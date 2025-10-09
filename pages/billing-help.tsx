export default function BillingHelp() {
  return (
    <main className="min-h-screen bg-gray-50 flex justify-center items-center p-8">
      <div className="max-w-2xl bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-4">Billing & Refund Policy</h1>
        <p className="mb-3 text-gray-700">We aim to make payments simple and transparent.</p>
        <ul className="list-disc ml-5 text-gray-600 space-y-2">
          <li>All payments are securely processed through Stripe.</li>
          <li>Documents are generated immediately after payment.</li>
          <li>If there’s a technical issue preventing delivery, contact us within 48 hours for review.</li>
          <li>Refunds are issued only for errors or system failures, not for user input mistakes.</li>
        </ul>
        <p className="mt-6 text-gray-500 text-sm">Need help? Visit our <a href="/support" className="text-blue-600 hover:underline">Support Page</a>.</p>
      </div>
    </main>
  );
}
