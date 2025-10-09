"use client";

import Link from "next/link";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <section className="bg-white rounded-2xl shadow-xl p-10 max-w-2xl w-full text-gray-800">
        <h1 className="text-3xl font-bold text-center mb-6">
          Customer Support & Legal Info
        </h1>

        <p className="text-gray-600 text-center mb-8">
          Need help? We’re here to make sure your documents, filings, and
          payments go smoothly. Please check the resources below or reach out.
        </p>

        <div className="space-y-6">
          {/* Contact Info */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">
              💬 Contact Support
            </h2>
            <p>
              Email us anytime at{" "}
              <a
                href="mailto:support@quicklegalbiz.com"
                className="text-blue-600 underline hover:text-blue-800"
              >
                support@quicklegalbiz.com
              </a>{" "}
              and our Legal Process Specialists will respond within 24 hours.
            </p>
          </div>

          {/* Common Questions */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">
              📘 Common Questions
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Where can I find my receipt? — Check your email inbox.</li>
              <li>
                How long until my motion is filed? — Within 24 hours of payment,
                unless otherwise notified.
              </li>
              <li>
                Can I update my document after paying? — Yes, email support with
                your session ID or case number.
              </li>
            </ul>
          </div>

          {/* Legal Disclaimer */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">
              ⚖️ Legal Notice
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              QuickLegalBiz and its AI-powered systems are <strong>not a law firm</strong> 
              and do not provide legal representation. Documents are generated
              based on user input and verified by Legal Process Specialists for
              accuracy and compliance. Filing results are not guaranteed, and
              users remain responsible for submission accuracy and any required
              follow-up.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Home
          </Link>
          <Link
            href="/start"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Start a New Document
          </Link>
        </div>
      </section>
    </main>
  );
}