"use client";
import React, { useState, useEffect } from "react";

export default function DocGenerator() {
  const [title, setTitle] = useState("");
  const [formType, setFormType] = useState("Motion");
  const [caseNumber, setCaseNumber] = useState("");
  const [county, setCounty] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [uploading, setUploading] = useState(false);
  const [docs, setDocs] = useState([]);
  const [error, setError] = useState<string | null>(null);

  // Refresh document list
  useEffect(() => {
    refreshDocs();
  }, []);

  async function refreshDocs() {
    try {
      const res = await fetch("/api/getDocuments");
      if (!res.ok) throw new Error("Failed to fetch docs");
      const data = await res.json();
      setDocs(data.docs || []);
    } catch (err: any) {
      console.error("refreshDocs error:", err);
      setError("Could not load your documents.");
    }
  }

  async function handleUploadFinal(file: File) {
    if (!file) return alert("Please choose a file first");
    setUploading(true);
    setError(null);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", title || file.name);
    fd.append("formType", formType);
    fd.append("caseNumber", caseNumber);
    fd.append("county", county);
    fd.append("date", date);

    try {
      // Try Supabase upload first
      let upload = await fetch("/api/upload", { method: "POST", body: fd });
      if (!upload.ok) {
        console.warn("Supabase upload failed, switching to local...");
        upload = await fetch("/api/upload-local", { method: "POST", body: fd });
      }

      const upJson = await upload.json();
      if (!upload.ok) throw new Error(upJson.error || "Upload failed");

      // Vault ingestion
      const meta = await fetch("/api/vault/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          fileUrl: upJson.publicUrl,
          formType,
          caseNumber,
          county,
          date,
        }),
      });

      if (!meta.ok) throw new Error("Vault insert failed");

      await refreshDocs();
      alert("Upload successful!");
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
      <h2>Document Generator</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.75rem",
          marginTop: "1rem",
        }}
      >
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ gridColumn: "1 / span 2", padding: "0.5rem" }}
        />

        <select
          value={formType}
          onChange={(e) => setFormType(e.target.value)}
          style={{ gridColumn: "1 / span 2", padding: "0.5rem" }}
        >
          <option>Motion</option>
          <option>Affidavit</option>
          <option>Notice</option>
          <option>Subpoena</option>
          <option>Summons</option>
          <option>Certificate of Service</option>
        </select>

        <input
          placeholder="Case #"
          value={caseNumber}
          onChange={(e) => setCaseNumber(e.target.value)}
          style={{ padding: "0.5rem" }}
        />

        <input
          placeholder="County"
          value={county}
          onChange={(e) => setCounty(e.target.value)}
          style={{ padding: "0.5rem" }}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ gridColumn: "1 / span 2", padding: "0.5rem" }}
        />

        <input
          id="fileInput"
          type="file"
          style={{ gridColumn: "1 / span 2" }}
          onChange={(e) => {
            if (e.target.files?.[0]) handleUploadFinal(e.target.files[0]);
          }}
        />
      </div>

      {uploading && <p>Uploading document...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: "2rem" }}>
        <h3>My Documents</h3>
        {docs.length === 0 ? (
          <p>No documents yet.</p>
        ) : (
          <ul>
            {docs.map((doc: any) => (
              <li key={doc.id}>
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {doc.title || doc.file_url}
                </a>{" "}
                — {doc.formType} ({doc.date})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}