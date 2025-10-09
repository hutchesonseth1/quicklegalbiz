export default function Cancel() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-red-50">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Canceled ❌</h1>
      <p className="text-gray-700">No charge was made. You can retry anytime.</p>
    </div>
  );
}
