import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type RoastLevel = "light" | "medium" | "dark";

function cleanText(s: string) {
  return s
    .replace(/\s+/g, " ")
    .replace(/\|/g, " ")
    .trim()
    .slice(0, 6000);
}

function extractReadableText(html: string) {
  const $ = cheerio.load(html);

  $("script, style, noscript, svg, nav, footer, header, iframe").remove();

  const selectors = [
    "main",
    "article",
    ".product",
    ".product-details",
    ".product-description",
    ".description",
    ".content",
  ];

  let best = "";

  for (const sel of selectors) {
    const text = cleanText($(sel).text());
    if (text.length > best.length) best = text;
  }

  if (best.length < 300) {
    best = cleanText($("body").text());
  }

  return best;
}

async function classifyRoast(input: {
  roaster: string;
  bean: string;
  pageText: string;
}) {
  const prompt = `
Classify the coffee roast as light, medium, or dark.
Return JSON ONLY with keys:
- roast_level_ai
- roast_confidence (0–1)
- roast_reason

Rules:
- light: floral, citrus, tea-like, filter, bright acidity
- medium: balanced, caramel, chocolate, espresso blend, milk friendly
- dark: bold, intense, smoky, traditional, low acidity
- if unclear: choose medium with low confidence

Roaster: ${input.roaster}
Coffee: ${input.bean}

Page text:
${input.pageText.slice(0, 2500)}
`.trim();

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: prompt,
      text: { format: { type: "json_object" } },
    }),
  });

  if (!res.ok) {
    throw new Error("OpenAI request failed");
  }

  const json = await res.json();
  const text = json.output[0].content[0].text;
  return JSON.parse(text);
}

export async function POST(req: Request) {
  try {
    const { bean_id } = await req.json();
    if (!bean_id) {
      return NextResponse.json({ error: "bean_id required" }, { status: 400 });
    }

    const { data: bean, error } = await supabaseAdmin
      .from("beans")
      .select("id, roaster, name, source_url")
      .eq("id", bean_id)
      .single();

    if (error || !bean) {
      return NextResponse.json({ error: "Bean not found" }, { status: 404 });
    }

    if (!bean.source_url) {
      return NextResponse.json(
        { error: "Bean has no source_url" },
        { status: 400 }
      );
    }

    const page = await fetch(bean.source_url, {
      headers: { "User-Agent": "DialMyCoffeeBot/1.0" },
    });

    if (!page.ok) {
      return NextResponse.json(
        { error: "Failed to fetch product page" },
        { status: 400 }
      );
    }

    const html = await page.text();
    const pageText = extractReadableText(html);

    const ai = await classifyRoast({
      roaster: bean.roaster,
      bean: bean.name,
      pageText,
    });

    await supabaseAdmin
      .from("beans")
      .update({
        description: pageText.slice(0, 2000),
        roast_level_ai: ai.roast_level_ai,
        roast_confidence: ai.roast_confidence,
        roast_reason: ai.roast_reason,
        last_enriched_at: new Date().toISOString(),
      })
      .eq("id", bean_id);

    return NextResponse.json({ success: true, ...ai });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
