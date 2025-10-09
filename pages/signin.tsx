// pages/signin.tsx
import { getProviders, signIn } from "next-auth/react";

export default function SignIn({ providers }: any) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="p-8 bg-white rounded shadow space-y-4">
        <h1 className="text-xl font-bold">Sign in</h1>
        {Object.values(providers).map((provider: any) => (
          <button
            key={provider.id}
            onClick={() => signIn(provider.id)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Sign in with {provider.name}
          </button>
        ))}
      </div>
    </main>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return { props: { providers } };
}