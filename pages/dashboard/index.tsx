import { useState, useEffect } from "react";

export default function Dashboard() {
  const [form, setForm] = useState({ name: "", email: "", docType: "" });
  const [message, setMessage] = useState("");
  const [docs, setDocs] = useState<any[]>([]);

  // Fetch saved docs on load
  useEffect(() => {
    const fetchDocs = async () => {
      const res = await fetch("/api/getDocuments");
      if (res.ok) {
        const data = await res.json();
        setDocs(data);
      }
    };
    fetchDocs();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/saveDocument", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMessage("✅ Document saved!");
      setForm({ name: "", email: "", docType: "" });

      // refresh table
      const updated = await res.json();
      setDocs((prev) => [...prev, updated]);
    } else {
      setMessage("❌ Error saving document");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">QuickLegalBiz Dashboard</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-md bg-white p-4 rounded shadow mb-6">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border mb-2"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border mb-2"
          required
        />
        <select
          name="docType"
          value={form.docType}
          onChange={handleChange}
          className="w-full p-2 border mb-2"
          required
        >
          <option value="">Select Doc Type</option>
          <option value="Lien">Lien</option>
          <option value="Affidavit">Affidavit</option>
          <option value="Motion">Motion</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </form>

      {message && <p className="mt-3">{message}</p>}

      {/* Docs List */}
      <h2 className="text-xl font-semibold mb-2">Saved Documents</h2>
      {docs.length === 0 ? (
        <p>No documents yet.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">Name</th>
              <th className="border px-3 py-2">Email</th>
              <th className="border px-3 py-2">Type</th>
              <th className="border px-3 py-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((doc, i) => (
              <tr key={i}>
                <td className="border px-3 py-2">{doc.name}</td>
                <td className="border px-3 py-2">{doc.email}</td>
                <td className="border px-3 py-2">{doc.docType}</td>
                <td className="border px-3 py-2">
                  {new Date(doc.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}