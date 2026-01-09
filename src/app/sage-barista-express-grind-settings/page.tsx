import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sage Barista Express Grind Settings Guide | Dialmycoffee",
  description: "Complete guide to Sage Barista Express grind settings. Get AI-powered recommendations for your coffee beans. Grind size chart, troubleshooting tips, and dial-in guide.",
  keywords: "Sage Barista Express grind settings, Sage Barista Express grind size, espresso grind settings, Sage grinder settings, Barista Express dial in",
};

export default function SageBarstaExpressPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white">
          Sage Barista Express Grind Settings Guide
        </h1>
        <p className="text-lg text-zinc-300">
          The complete guide to dialing in your Sage Barista Express espresso machine. Get perfect grind settings for any coffee bean.
        </p>
      </div>

      {/* Quick Reference */}
      <div className="rounded-xl border border-amber-700/35 bg-zinc-950 p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">Quick Reference</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-amber-200">Grind Range</h3>
            <p className="text-zinc-300">1-16 (1 = finest, 16 = coarsest)</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-amber-200">Espresso Sweet Spot</h3>
            <p className="text-zinc-300">Settings 5-10</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-amber-200">Medium Roast Starting Point</h3>
            <p className="text-zinc-300">Setting 7-8</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-amber-200">Light Roast Starting Point</h3>
            <p className="text-zinc-300">Setting 5-6 (finer)</p>
          </div>
        </div>
      </div>

      {/* Understanding the Grinder */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Understanding the Sage Barista Express Grinder</h2>
        <p className="text-zinc-300">
          The Sage Barista Express features a built-in conical burr grinder with 16 grind settings. Each number represents a different grind size:
        </p>
        <ul className="space-y-2 text-zinc-300 ml-6">
          <li className="flex gap-2">
            <span className="text-amber-400">•</span>
            <span><strong className="text-white">Settings 1-4:</strong> Very fine - Risk of choking the machine, best for very light roasts</span>
          </li>
          <li className="flex gap-2">
            <span className="text-amber-400">•</span>
            <span><strong className="text-white">Settings 5-10:</strong> Espresso range - Most beans work in this range</span>
          </li>
          <li className="flex gap-2">
            <span className="text-amber-400">•</span>
            <span><strong className="text-white">Settings 11-16:</strong> Coarser - Better for filter coffee or very dark roasts</span>
          </li>
        </ul>
      </div>

      {/* How to Dial In */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">How to Dial In Your Espresso</h2>
        <div className="space-y-3 text-zinc-300">
          <p><strong className="text-white">Step 1: Start at Setting 7-8</strong></p>
          <p>For medium roast beans, begin at setting 7 or 8. This is the sweet spot for most beans.</p>
          
          <p className="pt-3"><strong className="text-white">Step 2: Pull a Test Shot</strong></p>
          <p>Aim for 18g in, 36g out, in 25-30 seconds.</p>
          
          <p className="pt-3"><strong className="text-white">Step 3: Taste and Adjust</strong></p>
          <ul className="space-y-2 ml-6">
            <li className="flex gap-2">
              <span className="text-amber-400">•</span>
              <span><strong className="text-white">Too sour/fast:</strong> Grind finer (lower number, e.g., 7 → 6)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400">•</span>
              <span><strong className="text-white">Too bitter/slow:</strong> Grind coarser (higher number, e.g., 7 → 8)</span>
            </li>
          </ul>
          
          <p className="pt-3"><strong className="text-white">Step 4: Fine-tune</strong></p>
          <p>Adjust in single increments until you achieve balanced, sweet espresso.</p>
        </div>
      </div>

      {/* Common Issues */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Common Grind Issues & Solutions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Shot Pours Too Fast (Under 20 seconds)</h3>
            <p className="text-zinc-300"><strong className="text-white">Solution:</strong> Grind finer. Move down 1-2 settings (e.g., 8 → 6).</p>
          </div>
          
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Shot Pours Too Slow (Over 40 seconds)</h3>
            <p className="text-zinc-300"><strong className="text-white">Solution:</strong> Grind coarser. Move up 1-2 settings (e.g., 6 → 8).</p>
          </div>
          
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Machine Chokes (No Flow)</h3>
            <p className="text-zinc-300"><strong className="text-white">Solution:</strong> Grind much coarser. Try setting 10 or higher.</p>
          </div>
          
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Sour/Acidic Taste</h3>
            <p className="text-zinc-300"><strong className="text-white">Solution:</strong> Under-extracted. Grind finer or increase temperature.</p>
          </div>
          
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Bitter/Harsh Taste</h3>
            <p className="text-zinc-300"><strong className="text-white">Solution:</strong> Over-extracted. Grind coarser or decrease temperature.</p>
          </div>
        </div>
      </div>

      {/* Bean-Specific Recommendations */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Grind Settings by Roast Level</h2>
        <div className="space-y-3">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Light Roast Beans</h3>
            <p className="text-zinc-300">Denser structure, harder to extract</p>
            <p className="text-white font-medium mt-2">Recommended: Settings 5-7</p>
          </div>
          
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Medium Roast Beans</h3>
            <p className="text-zinc-300">Balanced extraction, most versatile</p>
            <p className="text-white font-medium mt-2">Recommended: Settings 7-9</p>
          </div>
          
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Dark Roast Beans</h3>
            <p className="text-zinc-300">Porous, easier to extract, risk of bitterness</p>
            <p className="text-white font-medium mt-2">Recommended: Settings 9-11</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-xl border border-amber-700/35 bg-gradient-to-br from-amber-700/20 to-amber-900/20 p-8 text-center">
        <h2 className="text-2xl font-semibold text-white mb-3">
          Get AI-Powered Grind Recommendations
        </h2>
        <p className="text-zinc-300 mb-6 max-w-2xl mx-auto">
          Stop guessing! Our AI analyzes your specific coffee beans and gives you the perfect starting grind setting for your Sage Barista Express.
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-amber-700 px-8 py-4 text-lg font-semibold text-white hover:bg-amber-600 transition"
        >
          Try Free Grind Calculator →
        </Link>
      </div>

      {/* FAQ */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-white mb-2">What is the best grind setting for espresso on Sage Barista Express?</h3>
            <p className="text-zinc-300">For most medium roast beans, start at setting 7-8. Light roasts work better at 5-6, while dark roasts prefer 9-10.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-2">How do I adjust the grind size on Sage Barista Express?</h3>
            <p className="text-zinc-300">Turn the grind size dial on top of the grinder while it is running. Always purge 2-3g after adjusting to clear old grounds.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Why is my Sage Barista Express grinding too fine?</h3>
            <p className="text-zinc-300">The burrs may need cleaning or calibration. Run grinder cleaning tablets and ensure the grind dial moves freely.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Should I change grind setting when switching beans?</h3>
            <p className="text-zinc-300">Yes, always re-dial when switching beans. Different roasts and origins require different grind sizes for optimal extraction.</p>
          </div>
        </div>
      </div>

      {/* Back link */}
      <div className="pt-8">
        <Link
          href="/"
          className="text-amber-200 hover:text-amber-100 transition"
        >
          ← Back to Grind Calculator
        </Link>
      </div>
    </div>
  );
}
