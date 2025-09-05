export default function SuccessPage() {
  return (
    <div className="max-w-lg mx-auto mt-20 text-center">
      <h1 className="text-3xl font-bold mb-4">🎉 Payment Successful!</h1>
      <p className="mb-6">You now have access to the form.</p>
      <a href="/forms/create" className="text-blue-600 underline">
        Go to Form →
      </a>
    </div>
  );
}
