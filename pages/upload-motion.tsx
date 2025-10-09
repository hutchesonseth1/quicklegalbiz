"use client";
import Layout from "../components/Layout";
import { useState } from "react";

export default function UploadMotion() {
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return alert("Please select a motion document.");

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);

    const res = await fetch("/api/analyze-motion", { method: "POST", body: formData });
    const data = await res.json();

    setResult(data.checklist || []);
    setLoading(false);
  }

  return (
    <Layout>
      <main className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Upload Your Motion for AI Review</h1>

        <form onSubmit={handleSubmit} className="w-full max-w-md bg-gray-100 p-6 rounded-lg shadow-md space-y-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full border rounded px-4 py-2" required />
          <input type="file" accept=".txt,.pdf,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full border rounded px-4 py-2" required />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            {loading ? "Analyzing..." : "Analyze Motion"}
          </button>
        </form>

        {result.length > 0 && (
          <div className="mt-8 w-full max-w-md bg-white border rounded-lg p-4 shadow">
            <h2 className="font-semibold mb-2">Your Motion Checklist:</h2>
            <ul className="text-left text-gray-700 list-disc list-inside">
              {result.map((item, i) => (<li key={i}>{item}</li>))}
            </ul>
          </div>
        )}
      </main>
    </Layout>
  );
}
