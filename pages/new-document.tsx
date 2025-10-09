import { useEffect, useState } from "react";

type Doc = {
  id: number;
  name: string;
  email: string;
  docType: string;
  filename: string;
  createdAt: string;
};

export default function MyDocuments() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [docType, setDocType] = useState("General");
  const [filename, setFilename] = useState("");

  // Fetch docs
  const fetchDocs = async () => {
    try {
      const res = await fetch("/api/saveDocument");
      if (!res.ok) throw new Error("Failed to fetch documents");
      const data = await res.json();
      setDocs(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Error loading documents:", err);
      setError("Could not load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/saveDocument", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, docType, filename }),
      });

      if (!res.ok) throw new Error("Failed to save document");

      setName("");
      setEmail("");
      setDocType("General");
      setFilename("");
      await fetchDocs(); // refresh the list
    } catch (err: any) {
      console.error("Error saving document:", err);
      setError("Could not save document");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📂 My Documents</h1>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <h2>Add a New Document</h2>
        <div>
          <label>Name: </label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email: </label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Type: </label>
          <input value={docType} onChange={(e) => setDocType(e.target.value)} />
        </div>
        <div>
          <label>Filename: </label>
          <input value={filename} onChange={(e) => setFilename(e.target.value)} required />
        </div>
        <button type="submit" style={{ marginTop: "1rem" }}>Save</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && docs.length === 0 && (
        <p>No documents found.</p>
      )}

      {docs.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc" }}>Name</th>
              <th style={{ borderBottom: "1px solid #ccc" }}>Email</th>
              <th style={{ borderBottom: "1px solid #ccc" }}>Type</th>
              <th style={{ borderBottom: "1px solid #ccc" }}>File</th>
              <th style={{ borderBottom: "1px solid #ccc" }}>Created</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.name}</td>
                <td>{doc.email}</td>
                <td>{doc.docType}</td>
                <td>{doc.filename}</td>
                <td>{new Date(doc.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}