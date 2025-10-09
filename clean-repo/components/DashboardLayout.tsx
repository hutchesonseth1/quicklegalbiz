import React from "react";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="font-semibold text-lg">
            LegalPad
          </Link>
          <div className="space-x-4 text-sm">
            <Link href="/form">Form</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
