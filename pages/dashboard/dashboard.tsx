import React, { useState, useEffect } from "react";

export default function Dashboard() {
  const [docs, setDocs] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // hardcoded test user
  const userId = "test-user-1";

  // fetch saved docs
  useEffect(() => {
    fetch(`/api/docs?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setDocs(data))
      .catch((err) => console.error("Error fetching docs:", err));
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/docs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, title, content }),
      });
      const newDoc = await res.json();
      setDocs([...docs, newDoc]); // add to list
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard (Test Mode)</h1>

      <div className="mb-4 space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="Document title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border p-2 w-full"
          placeholder="Document content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSave}
        >
          Save Doc
        </button>
      </div>

      <h2 className="text-xl font-semibold mt-6">Saved Docs</h2>
      <ul className="mt-2 space-y-2">
        {docs.map((doc) => (
          <li key={doc.id} className="border p-2 rounded">
            <strong>{doc.title}</strong>
            <p>{doc.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}