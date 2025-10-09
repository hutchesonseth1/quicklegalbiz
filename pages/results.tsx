"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResultsPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Retrieve answers safely from sessionStorage
    const storedAnswers = sessionStorage.getItem("qlb_answers");
    if (storedAnswers) {
      try {
        setAnswers(JSON.parse(storedAnswers));
      } catch {
        console.error("Invalid stored answers, resetting...");
        sessionStorage.removeItem("qlb_answers");
        setAnswers([]);
      }
    }
    setLoading(false);
  }, []);

  const handleEdit = () => {
    router.push("/start"); // Go back to intake
  };

  const handleProceedToCheckout = async () => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: "demo@example.com", // ⚠️ Replace dynamically later
          amount: 4900,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // redirect to Stripe Checkout
      } else {
        alert("Unable to start checkout. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong starting checkout.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading your results...
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-6">
      <section className="bg-white shadow-lg rounded-xl p-10 max-w-lg w-full text-center border border-gray-200">
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          Great news 🎉
        </h2>

        <p className="text-gray-700 mb-6">
          Based on your answers, we’re preparing the most relevant motion or
          legal document for your case.
        </p>

        {/* Summary Box */}
        <div className="border border-gray-300 rounded-md p-4 mb-6 text-left bg-gray-50">
          <h3 className="font-semibold text-gray-700 mb-2">
            Your Input Summary:
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-600">
            {answers.length > 0 ? (
              answers.map((answer, index) => (
                <li key={index}>{answer || "No response"}</li>
              ))
            ) : (
              <li>No responses recorded.</li>
            )}
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleEdit}
            className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition"
          >
            Edit Answers
          </button>

          <button
            onClick={handleProceedToCheckout}
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </section>
    </main>
  );
}