import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Breville Barista Pro Grind Settings Guide | Dialmycoffee",
  description: "Complete guide to Breville Barista Pro grind settings. Get AI-powered recommendations for perfect espresso. Grind size chart, troubleshooting, and dial-in tips.",
  keywords: "Breville Barista Pro grind settings, Barista Pro grind size, Breville espresso settings, Breville grinder settings",
};

export default function BrevilleBaristaPro() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white">
          Breville Barista Pro Grind Settings Guide
        </h1>
        <p className="text-lg text-zinc-300">
          Master your Breville Barista Pro with our complete grind settings guide. Get perfect espresso every time.
        </p>
      </div>

      <div className="rounded-xl border border-amber-700/35 bg-zinc-950 p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">Quick Reference</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-amber-200">Grind Range</h3>
            <p className="text-zinc-300">1-30 (1 = finest, 30 = coarsest)</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-amber-200">Espresso Sweet Spot</h3>
            <p className="text-zinc-300">Settings 8-15</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-amber-200">Medium Roast Starting Point</h3>
            <p className="text-zinc-300">Setting 11-12</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-amber-200">Light Roast Starting Point</h3>
            <p className="text-zinc-300">Setting 8-10 (finer)</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Understanding the Breville Barista Pro Grinder</h2>
        <p className="text-zinc-300">
          The Breville Barista Pro features a precision conical burr grinder with 30 grind settings. This gives you exceptional control over your grind size:
        </p>
        <ul className="space-y-2 text-zinc-300 ml-6">
          <li className="flex gap-2">
            <span className="text-amber-400">•</span>
            <span><strong className="text-white">Settings 1-7:</strong> Very fine - Risk of choking, best for ultra-light roasts</span>
          </li>
          <li className="flex gap-2">
            <span className="text-amber-400">•</span>
            <span><strong className="text-white">Settings 8-15:</strong> Espresso range - Most beans work perfectly here</span>
          </li>
          <li className="flex gap-2">
            <span className="text-amber-400">•</span>
            <span><strong className="text-white">Settings 16-30:</strong> Coarser - For filter coffee or very dark roasts</span>
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">How to Dial In Your Espresso</h2>
        <div className="space-y-3 text-zinc-300">
          <p><strong className="text-white">Step 1: Start at Setting 11-12</strong></p>
          <p>For medium roast beans, begin at setting 11 or 12. This is the sweet spot for most beans on the Barista Pro.</p>
          
          <p className="pt-3"><strong className="text-white">Step 2: Pull a Test Shot</strong></p>
          <p>Aim for 18-20g dose, 36-40g yield, in 25-30 seconds.</p>
          
          <p className="pt-3"><strong className="text-white">Step 3: Taste and Adjust</strong></p>
          <ul className="space-y-2 ml-6">
            <li className="flex gap-2">
              <span className="text-amber-400">•</span>
              <span><strong className="text-white">Too sour/fast:</strong> Grind finer (lower number, e.g., 12 → 10)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400">•</span>
              <span><strong className="text-white">Too bitter/slow:</strong> Grind coarser (higher number, e.g., 12 → 14)</span>
            </li>
          </ul>
          
          <p className="pt-3"><strong className="text-white">Step 4: Fine-tune</strong></p>
          <p>The Barista Pro has 30 settings, so adjust in 1-2 increment steps for precision.</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Common Grind Issues & Solutions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Shot Pours Too Fast (Under 20 seconds)</h3>
            <p className="text-zinc-300"><strong className="text-white">Solution:</strong> Grind finer. Move down 2-3 settings (e.g., 12 → 9).</p>
          </div>
          
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Shot Pours Too Slow (Over 40 seconds)</h3>
            <p className="text-zinc-300"><strong className="text-white">Solution:</strong> Grind coarser. Move up 2-3 settings (e.g., 12 → 15).</p>
          </div>
          
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Machine Chokes (No Flow)</h3>
            <p className="text-zinc-300"><strong className="text-white">Solution:</strong> Way too fine. Jump to setting 15-18.</p>
          </div>
          
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Sour/Acidic Taste</h3>
            <p className="text-zinc-300"><strong className="text-white">Solution:</strong> Under-extracted. Grind 2-3 settings finer.</p>
          </div>
          
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Bitter/Harsh Taste</h3>
            <p className="text-zinc-300"><strong className="text-white">Solution:</strong> Over-extracted. Grind 2-3 settings coarser.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Grind Settings by Roast Level</h2>
        <div className="space-y-3">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Light Roast Beans</h3>
            <p className="text-zinc-300">Dense beans, need finer grind for proper extraction</p>
            <p className="text-white font-medium mt-2">Recommended: Settings 8-11</p>
          </div>
          
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Medium Roast Beans</h3>
            <p className="text-zinc-300">Balanced, work in the middle of espresso range</p>
            <p className="text-white font-medium mt-2">Recommended: Settings 11-13</p>
          </div>
          
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-medium text-amber-200 mb-2">Dark Roast Beans</h3>
            <p className="text-zinc-300">Porous, easier to extract, need coarser grind</p>
            <p className="text-white font-medium mt-2">Recommended: Settings 13-16</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-amber-700/35 bg-gradient-to-br from-amber-700/20 to-amber-900/20 p-8 text-center">
        <h2 className="text-2xl font-semibold text-white mb-3">
          Get AI-Powered Grind Recommendations
        </h2>
        <p className="text-zinc-300 mb-6 max-w-2xl mx-auto">
          Our AI analyzes your specific coffee beans and gives you the perfect starting grind setting for your Breville Barista Pro.
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
            <h3 className="text-lg font-medium text-white mb-2">What is the best grind setting for Breville Barista Pro?</h3>
            <p className="text-zinc-300">For medium roast beans, start at 11-12. Light roasts work at 8-10, dark roasts at 13-16.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-2">How fine should I grind for espresso on Barista Pro?</h3>
            <p className="text-zinc-300">The espresso range is settings 8-15. Most beans work best between 10-13.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Why does my Breville Barista Pro choke?</h3>
            <p className="text-zinc-300">Grind is too fine. Move to a coarser setting (higher number). Also check your dose is not too high.</p>
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
