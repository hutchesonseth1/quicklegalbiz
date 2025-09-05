"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Home" },
  { href: "/form", label: "Form" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav className="w-full border-b">
      <div className="mx-auto max-w-5xl flex items-center justify-between p-4">
        <Link href="/" className="font-semibold">LegalPad</Link>
        <div className="flex gap-4">
          {tabs.map(t => (
            <Link
              key={t.href}
              href={t.href}
              className={`text-sm ${path === t.href ? "font-semibold" : "opacity-70 hover:opacity-100"}`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
