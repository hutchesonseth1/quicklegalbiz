import React from "react";          // ✅ Required in some setups
import Link from "next/link";       // ✅ Valid import

export default function CallToAction() {
  return (
    <div className="text-center mt-10">
      <Link href="/form">
        <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
          Start for Free
        </button>
      </Link>
    </div>
  );
}
