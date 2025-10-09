import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading…</p>;
  }

  if (!session) {
    return <p>Redirecting to login…</p>;
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="p-6 bg-white rounded shadow">
        <h1 className="text-xl font-bold">Welcome, {session.user?.name}</h1>
        <p className="text-gray-600">Email: {session.user?.email}</p>
      </div>
    </main>
  );
}