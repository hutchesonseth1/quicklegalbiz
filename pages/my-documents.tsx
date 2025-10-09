import { prisma } from "@/lib/prisma";

export async function getServerSideProps() {
  const documents = await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
  });
  return { props: { documents: JSON.parse(JSON.stringify(documents)) } };
}

export default function MyDocuments({ documents }: { documents: any[] }) {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Documents</h1>
      <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="text-left px-4 py-2">Name</th>
            <th className="text-left px-4 py-2">Email</th>
            <th className="text-left px-4 py-2">Type</th>
            <th className="text-left px-4 py-2">File</th>
            <th className="text-left px-4 py-2">Created</th>
          </tr>
        </thead>
        <tbody>
          {documents.length > 0 ? (
            documents.map((doc) => (
              <tr key={doc.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{doc.name}</td>
                <td className="px-4 py-2">{doc.email}</td>
                <td className="px-4 py-2">{doc.docType || "—"}</td>
                <td className="px-4 py-2">
                  <a
                    href={`/uploads/${doc.filename}`}
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {doc.filename}
                  </a>
                </td>
                <td className="px-4 py-2 text-gray-500">
                  {new Date(doc.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                No documents found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
