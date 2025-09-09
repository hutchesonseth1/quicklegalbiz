import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="max-w-lg mx-auto mt-20 text-center">
      <h1 className="text-3xl font-bold mb-4">🎉 Payment Successful!</h1>
      <p className="mb-6">You now have access to the form.</p>
        <Link href="/form/create">

        <span className="text-blue-600 underline cursor-pointer">
          Go to Form →
        </span>
      </Link>
    </div>
  );
}
