import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-[#0F1115] text-[#F4F4F2]">
      <div className="mx-auto max-w-md px-5 py-10">
        <h1 className="text-3xl font-semibold">Payment successful 🎉</h1>
        <p className="mt-2 text-white/70">
          You’re now on Dialmycoffee Pro.
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            href="/"
            className="rounded-xl bg-[#C48A5A] px-4 py-3 text-sm font-semibold text-[#0F1115]"
          >
            Go to homepage
          </Link>
          <Link
            href="/pro"
            className="rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold"
          >
            Back to Pro
          </Link>
        </div>
      </div>
    </main>
  );
}
