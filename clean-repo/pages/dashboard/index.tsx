import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useIdleLock from "@/components/useIdleLock";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Call the hook properly, don't render the object.
  const { unlocked, unlock, lock } = useIdleLock(15 * 60 * 1000); // 15 min

  // Handle ?unlock=1 param after Google redirect
  useEffect(() => {
    if (router.query.unlock === "1") {
      unlock();
      const { unlock: _u, ...rest } = router.query as Record<string, string>;
      router.replace({ pathname: "/dashboard", query: rest }, undefined, { shallow: true });
    }
  }, [router, unlock]);

  if (status === "loading") return <main className="p-6">Loading…</main>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="opacity-70 text-sm">Signed in as {session?.user?.email}</p>

      {!unlocked ? (
        <div className="mt-6 rounded-xl border p-4">
          <p className="mb-3">For privacy, your workspace is locked.</p>
          <a href="/dashboard?unlock=1" className="inline-block rounded-lg border px-3 py-1">
            Open my workspace
          </a>
        </div>
      ) : (
        <>
          <div className="mt-6 flex items-center gap-3">
            <span className="text-sm opacity-70">
              Workspace unlocked (auto-locks after inactivity).
            </span>
            <button onClick={lock} className="rounded-lg border px-3 py-1">
              Lock now
            </button>
          </div>
          <section className="mt-4 rounded-xl border p-4">
            {/* 🔒 Sensitive widgets go here */}
            Your sensitive widgets load here…
          </section>
        </>
      )}
    </main>
  );
}

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx);
  if (!session) return { redirect: { destination: "/signin", permanent: false } };
  return { props: {} };
}
