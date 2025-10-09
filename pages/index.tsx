"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white text-gray-800 p-6">
      <section className="max-w-3xl text-center">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Legal Documents. Simplified.
        </h1>

        {/* Description */}
        <div className="text-lg text-gray-600 mb-10">
          <p>
            Our AI-powered legal assistant helps you identify the right court
            motion or document for your situation — fast, private, and
            affordable.
          </p>
          <p className="italic mt-2">
            Supported by Legal Process Specialists.
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => router.push("/start")}
          className="px-10 py-4 text-lg font-medium bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          Get Started — It’s Free
        </button>

        {/* Subtext */}
        <p className="mt-4 text-sm text-gray-500">
          No account required • No credit card • Instant results
        </p>
      </section>
    </main>
  );
}