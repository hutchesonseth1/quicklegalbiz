"use client";
import { useState } from "react";
import axios from "axios";
import { FileText, Send } from "lucide-react";
import StatusBar from "../components/StatusBar";

export default function Home() {
  const [type, setType] = useState("Motion");
  const [name, setName] = useState("");
  const [result, setResult] = useState("");
   return (
  <main className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6">
    <StatusBar />
    <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
      ...
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
    <main className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
          <FileText /> QuickLegalBiz Document Generator
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Document Type</label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border w-full p-2 rounded"
              placeholder="e.g., Motion, Affidavit, Subpoena"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Party Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border w-full p-2 rounded"
              placeholder="e.g., Seth Hutcheson"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Send size={16} /> Generate Document
          </button>
        </form>

        <div className="mt-6 bg-gray-100 p-3 rounded-lg text-sm min-h-[60px]">
          {result || "Results will appear here"}
        </div>
      </div>
    </main>
  );
}