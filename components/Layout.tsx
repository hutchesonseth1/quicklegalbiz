import Head from "next/head";
import Link from "next/link";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head>
        <title>QuickLegalBiz</title>
        <meta name="description" content="AI-powered legal motion filing made simple and fast." />
      </Head>

      <header className="w-full bg-white border-b shadow-sm p-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">QuickLegalBiz</Link>
        <nav className="space-x-4">
          <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
          <Link href="/upload-motion" className="text-gray-700 hover:text-blue-600">Upload</Link>
          <Link href="#pricing" className="text-gray-700 hover:text-blue-600">Pricing</Link>
        </nav>
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="bg-gray-100 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} QuickLegalBiz — All Rights Reserved.
      </footer>
    </>
  );
}
