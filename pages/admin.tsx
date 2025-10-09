import { useEffect, useState } from "react";
export default function Admin() {
  const [records, setRecords] = useState<any[]>([]);
  useEffect(() => { setRecords([{ email: "test@example.com", status: "sent" }]); }, []);
  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <table className="min-w-full border border-zinc-700">
        <thead><tr className="bg-zinc-800 text-left">
          <th className="p-2">Email</th><th className="p-2">Status</th></tr></thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={i} className="border-t border-zinc-700">
              <td className="p-2">{r.email}</td><td className="p-2">{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
