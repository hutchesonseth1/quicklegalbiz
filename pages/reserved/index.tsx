import Link form "next/link";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    console.log("[HOME] rendering / index.tsx");
  }, []);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-semibold">🏠 REAL HOME PAGE</h1>
      <p className="mt-2 opacity-80">AI + human review for legal forms.</p>

      <div className="mt-8 flex gap-3">
        <Link href="/form" className="rounded-lg border px-4 py-2">Start for Free</Link>
        <Link href="/signin" className="rounded-lg border px-4 py-2">Sign in</Link>
      </div>
    </main>
  );
}
