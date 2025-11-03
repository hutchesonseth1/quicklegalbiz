"use client";
import { useState } from "react";
import axios from "axios";
import { FileText, Send } from "lucide-react";

export default function Home() {
  const [type, setType] = useState("Motion");
  const [name, setName] = useState("");
  const [result, setResult] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();
    setResult("Processing...");
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/docgen`, { type, name });
      setResult(res.data.message || JSON.stringify(res.data));
    } catch (err: any) {
      setResult("❌ " + (err.message || "Request failed"));
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="bg-gray-800 shadow-2xl rounded-2xl p-8 w-full max-w-lg border border-gray-700">
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-6 text-blue-400">
          <FileText /> QuickLegalBiz Document Generator
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">
              Document Type
            </label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border border-gray-600 w-full p-3 rounded bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Motion, Affidavit, Subpoena"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">
              Party Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-600 w-full p-3 rounded bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Seth Hutcheson"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            <Send size={16} /> Generate Document
          </button>
        </form>

        <div className="mt-6 bg-gray-900 border border-gray-700 p-4 rounded-lg text-sm min-h-[60px] text-gray-200">
          {result || "Results will appear here"}
        </div>
      </div>
    </main>
  );
}