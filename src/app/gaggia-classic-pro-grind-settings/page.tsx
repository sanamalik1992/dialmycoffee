import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gaggia Classic Pro Grind Settings Guide | Dialmycoffee",
  description: "Complete Gaggia Classic Pro grind settings guide. Get perfect espresso grind recommendations for your external grinder. Dial-in tips and troubleshooting.",
  keywords: "Gaggia Classic Pro grind settings, Gaggia Classic grind size, Gaggia espresso grind, external grinder settings",
};

export default function GaggiaClassicPro() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white">
          Gaggia Classic Pro Grind Settings Guide
        </h1>
        <p className="text-lg text-zinc-300">
          The complete guide to dialing in your Gaggia Classic Pro. Learn optimal grind settings for perfect espresso extraction.
        </p>
      </div>

      <div className="rounded-xl border border-amber-700/35 bg-zinc-950 p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">Quick Reference</h2>
        <div className="space-y-3 text-zinc-300">
          <p><strong className="text-white">Important:</strong> The Gaggia Classic Pro does not have a built-in grinder. You need an external grinder.</p>
          <p className="mt-3"><strong className="text-white">Recommended Grinders:</strong></p>
          <ul className="space-y-1 ml-6">
            <li>• 1Zpresso JX-Pro (manual)</li>
            <li>• Niche Zero (electric)</li>
            <li>• Eureka Mignon (electric)</li>
            <li>• Baratza Sette 270 (electric)</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Grind Size for Gaggia Classic Pro</h2>
        <p className="text-zinc-300">
          The Gaggia Classic Pro requires fine espresso grind similar to table salt. Grind settings vary by grinder:
        </p>
        <div className="space-y-3 mt-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">1Zpresso JX-Pro</h3>
            <p className="text-white font-medium">1.2.0 to 1.6.0 (12-16 clicks from zero)</p>
            <p className="text-zinc-300 text-sm mt-1">Start at 1.4.0 for medium roasts</p>
          </div>
          
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Niche Zero</h3>
            <p className="text-white font-medium">Settings 10-15</p>
            <p className="text-zinc-300 text-sm mt-1">Start at 12 for medium roasts</p>
          </div>
          
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Baratza Sette 270</h3>
            <p className="text-white font-medium">Macro 5-9, Micro 1-5</p>
            <p className="text-zinc-300 text-sm mt-1">Start at Macro 7, Micro 3</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">How to Dial In with Gaggia Classic Pro</h2>
        <div className="space-y-3 text-zinc-300">
          <p><strong className="text-white">Step 1: Dose Correctly</strong></p>
          <p>Use 16-18g for a double shot. The Gaggia Classic Pro basket works best with this range.</p>
          
          <p className="pt-3"><strong className="text-white">Step 2: Start with Medium-Fine Grind</strong></p>
          <p>Aim for fine grind similar to table salt. This is your baseline.</p>
          
          <p className="pt-3"><strong className="text-white">Step 3: Target 25-30 Second Extraction</strong></p>
          <p>Aim for 32-36g output in 25-30 seconds (1:2 ratio).</p>
          
          <p className="pt-3"><strong className="text-white">Step 4: Adjust Based on Taste</strong></p>
          <ul className="space-y-2 ml-6">
            <li className="flex gap-2">
              <span className="text-amber-400">•</span>
              <span><strong className="text-white">Too sour:</strong> Grind finer or increase temperature</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400">•</span>
              <span><strong className="text-white">Too bitter:</strong> Grind coarser or lower temperature</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Common Issues with Gaggia Classic Pro</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Channeling (Uneven Extraction)</h3>
            <p className="text-zinc-300"><strong className="text-white">Solution:</strong> Improve distribution. Use WDT tool, level tamping, ensure even grind.</p>
          </div>
          
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Weak/Watery Shots</h3>
            <p className="text-zinc-300"><strong className="text-white">Solution:</strong> Grind finer. Your grind is too coarse or dose too low.</p>
          </div>
          
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Machine Chokes</h3>
            <p className="text-zinc-300"><strong className="text-white">Solution:</strong> Grind coarser. Also check your dose is not over 18g.</p>
          </div>
          
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Inconsistent Results</h3>
            <p className="text-zinc-300"><strong className="text-white">Solution:</strong> Get a better grinder. Entry-level grinders struggle with consistency.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Grind Settings by Roast Level</h2>
        <div className="space-y-3">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Light Roast Beans</h3>
            <p className="text-zinc-300">Dense, need finer grind and higher temperature (95-96°C)</p>
            <p className="text-white font-medium mt-2">Grind finer than medium roasts</p>
          </div>
          
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Medium Roast Beans</h3>
            <p className="text-zinc-300">Most versatile, standard espresso temperature (93-94°C)</p>
            <p className="text-white font-medium mt-2">Your baseline grind setting</p>
          </div>
          
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Dark Roast Beans</h3>
            <p className="text-zinc-300">Porous, need coarser grind and lower temp (90-92°C)</p>
            <p className="text-white font-medium mt-2">Grind coarser to avoid bitterness</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-amber-700/35 bg-gradient-to-br from-amber-700/20 to-amber-900/20 p-8 text-center">
        <h2 className="text-2xl font-semibold text-white mb-3">
          Get AI-Powered Grind Recommendations
        </h2>
        <p className="text-zinc-300 mb-6 max-w-2xl mx-auto">
          Our AI gives you optimal grind settings for your Gaggia Classic Pro based on your specific grinder and beans.
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-amber-700 px-8 py-4 text-lg font-semibold text-white hover:bg-amber-600 transition"
        >
          Try Free Grind Calculator →
        </Link>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Does Gaggia Classic Pro have a built-in grinder?</h3>
            <p className="text-zinc-300">No, you need a separate grinder. We recommend dedicated espresso grinders like 1Zpresso JX-Pro or Niche Zero.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-2">What grind size for Gaggia Classic Pro?</h3>
            <p className="text-zinc-300">Fine espresso grind, similar to table salt. Exact setting depends on your grinder model.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Best grinder for Gaggia Classic Pro?</h3>
            <p className="text-zinc-300">For manual: 1Zpresso JX-Pro. For electric: Niche Zero, Eureka Mignon Specialita, or Baratza Sette 270.</p>
          </div>
        </div>
      </div>

      <div className="pt-8">
        <Link href="/" className="text-amber-200 hover:text-amber-100 transition">
          ← Back to Grind Calculator
        </Link>
      </div>
    </div>
  );
}
