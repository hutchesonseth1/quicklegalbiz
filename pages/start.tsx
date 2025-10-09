"use client";
import { useState } from "react";
import { useRouter } from "next/router";

const questions = [
  { id: 1, text: "Hi — I’m your Legal Assistant. What should I call you?" },
  { id: 2, text: "What kind of legal issue are you dealing with?" },
  { id: 3, text: "Which state or county is your case in?" },
  { id: 4, text: "Do you already have a court case number?" },
  { id: 5, text: "Are you filing on your own behalf or for someone else?" },
  { id: 6, text: "Would you like us to file it for you or guide you through it?" },
];

export default function StartPage() {
  const [step, setStep] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [answers, setAnswers] = useState({});
  const totalSteps = questions.length;
  const router = useRouter();

  // 🎨 Dynamic Background Gradient
  const bgShade = 100 + Math.round((step / totalSteps) * 400);
  const bgClass = `bg-gradient-to-b from-slate-${bgShade} to-slate-${bgShade + 100} transition-all duration-700 ease-in-out`;

  const currentQuestion = questions[step - 1];

  function handleNext() {
    if (!inputValue.trim()) return; // ignore empty
    const newAnswers = { ...answers, [currentQuestion.id]: inputValue.trim() };
    setAnswers(newAnswers);
    setInputValue("");

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      console.log("✅ Intake complete:", newAnswers);
      router.push("/results");
    }
  }

  function handleBack() {
    if (step > 1) {
      setStep(step - 1);
      setInputValue(answers[questions[step - 2].id] || "");
    }
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNext();
    }
  }

  return (
    <main className={`min-h-screen flex items-center justify-center ${bgClass} p-6`}>
      <div
        className="bg-white/95 backdrop-blur-lg shadow-2xl rounded-xl p-8 max-w-md w-full text-center transition-all"
        style={{
          boxShadow: `0 0 ${10 + step * 5}px rgba(37, 99, 235, 0.25)`,
        }}
      >
        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          QuickLegalBiz — Guided Intake
        </h2>

        <p className="mb-4 text-gray-700 min-h-[3rem]">{currentQuestion.text}</p>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your answer and press Enter"
          className="border border-gray-300 rounded-md w-full p-3 mb-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex justify-center gap-3">
          {/* Back on left now */}
          {step > 1 && (
            <button
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
              onClick={handleBack}
            >
              Back
            </button>
          )}

          {/* Next on right now */}
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={handleNext}
          >
            {step === totalSteps ? "Finish" : "Next"}
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Step {step} of {totalSteps}
        </p>
      </div>
    </main>
  );
}