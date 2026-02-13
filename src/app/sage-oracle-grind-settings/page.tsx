import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sage Oracle Grind Settings Guide | Dialmycoffee",
  description: "Master your Sage Oracle with our complete grind settings guide. Get AI-powered recommendations for perfect espresso extraction every time.",
  keywords: "Sage Oracle grind settings, Sage Oracle grind size, Oracle espresso settings, Sage Oracle dial in",
};

export default function SageOracle() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white">
          Sage Oracle Grind Settings Guide
        </h1>
        <p className="text-lg text-zinc-300">
          Complete guide to dialing in your Sage Oracle espresso machine. Get perfect grind settings for any coffee bean.
        </p>
      </div>

      <div className="rounded-xl border border-amber-700/35 bg-zinc-950 p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">Quick Reference</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-amber-200">Grind Range</h3>
            <p className="text-zinc-300">1-45 (1 = finest, 45 = coarsest)</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-amber-200">Espresso Sweet Spot</h3>
            <p className="text-zinc-300">Settings 12-20</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-amber-200">Medium Roast Starting Point</h3>
            <p className="text-zinc-300">Setting 15-16</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-amber-200">Light Roast Starting Point</h3>
            <p className="text-zinc-300">Setting 12-14 (finer)</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Understanding the Sage Oracle Grinder</h2>
        <p className="text-zinc-300">
          The Sage Oracle features a premium conical burr grinder with 45 precise grind settings - nearly 3x more than entry-level machines:
        </p>
        <ul className="space-y-2 text-zinc-300 ml-6">
          <li className="flex gap-2">
            <span className="text-amber-400">•</span>
            <span><strong className="text-white">Settings 1-11:</strong> Very fine - For ultra-light roasts or ristretto</span>
          </li>
          <li className="flex gap-2">
            <span className="text-amber-400">•</span>
            <span><strong className="text-white">Settings 12-20:</strong> Espresso range - Perfect for most coffee beans</span>
          </li>
          <li className="flex gap-2">
            <span className="text-amber-400">•</span>
            <span><strong className="text-white">Settings 21-45:</strong> Coarser - For filter coffee or very dark roasts</span>
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">How to Dial In Your Espresso</h2>
        <div className="space-y-3 text-zinc-300">
          <p><strong className="text-white">Step 1: Start at Setting 15-16</strong></p>
          <p>For medium roast beans, begin at 15 or 16. The Oracle has exceptional precision at these settings.</p>
          
          <p className="pt-3"><strong className="text-white">Step 2: Use Auto-Dosing Feature</strong></p>
          <p>The Oracle automatically doses and tamps. Set dose to 19-22g depending on basket size.</p>
          
          <p className="pt-3"><strong className="text-white">Step 3: Target Extraction Time</strong></p>
          <p>Aim for 38-42g yield in 25-30 seconds (1:2 ratio).</p>
          
          <p className="pt-3"><strong className="text-white">Step 4: Fine-tune with Precision</strong></p>
          <ul className="space-y-2 ml-6">
            <li className="flex gap-2">
              <span className="text-amber-400">•</span>
              <span><strong className="text-white">Too sour/fast:</strong> Grind 1-2 settings finer</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400">•</span>
              <span><strong className="text-white">Too bitter/slow:</strong> Grind 1-2 settings coarser</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Oracle-Specific Tips</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Automatic Tamping Pressure</h3>
            <p className="text-zinc-300">The Oracle auto-tamps at consistent pressure. Focus on grind size and dose for dialing in.</p>
          </div>
          
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Temperature Control</h3>
            <p className="text-zinc-300">Adjust brew temperature: Light roasts at 93-94°C, dark roasts at 90-92°C.</p>
          </div>
          
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Purging Between Changes</h3>
            <p className="text-zinc-300">Always purge 3-5g after changing grind settings to clear old grounds.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Common Issues & Solutions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Inconsistent Extraction</h3>
            <p className="text-zinc-300"><strong className="text-white">Solution:</strong> Clean burrs regularly. The Oracle works best with weekly cleaning.</p>
          </div>
          
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Shot Pours Too Fast</h3>
            <p className="text-zinc-300"><strong className="text-white">Solution:</strong> Grind 2-3 settings finer or increase dose by 1g.</p>
          </div>
          
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Machine Chokes</h3>
            <p className="text-zinc-300"><strong className="text-white">Solution:</strong> Grind is way too fine. Jump to setting 18-20.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Grind Settings by Roast Level</h2>
        <div className="space-y-3">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Light Roast Beans</h3>
            <p className="text-zinc-300">Dense structure, need precision grinding</p>
            <p className="text-white font-medium mt-2">Recommended: Settings 12-15</p>
          </div>
          
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Medium Roast Beans</h3>
            <p className="text-zinc-300">Most versatile, work perfectly in espresso range</p>
            <p className="text-white font-medium mt-2">Recommended: Settings 15-17</p>
          </div>
          
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Dark Roast Beans</h3>
            <p className="text-zinc-300">Porous, extract quickly, need coarser grind</p>
            <p className="text-white font-medium mt-2">Recommended: Settings 17-20</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-amber-700/35 bg-gradient-to-br from-amber-700/20 to-amber-900/20 p-8 text-center">
        <h2 className="text-2xl font-semibold text-white mb-3">
          Get AI-Powered Grind Recommendations
        </h2>
        <p className="text-zinc-300 mb-6 max-w-2xl mx-auto">
          Our AI analyzes your specific coffee beans and gives you the perfect starting grind setting for your Sage Oracle.
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
            <h3 className="text-lg font-medium text-white mb-2">What is the best grind setting for Sage Oracle?</h3>
            <p className="text-zinc-300">For medium roasts, start at 15-16. Light roasts work at 12-14, dark roasts at 17-20.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-2">How does the Oracle compare to Barista Express?</h3>
            <p className="text-zinc-300">The Oracle has 45 settings vs 16 on the Express, plus automatic dosing and tamping for more consistency.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Should I adjust dose or grind first on Oracle?</h3>
            <p className="text-zinc-300">Always adjust grind size first. The Oracle&apos;s auto-dosing should be set once and left at your preferred dose.</p>
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
