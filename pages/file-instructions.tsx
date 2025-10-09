export default function FileInstructions() {
  const intake = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("qlb_answers") || "{}") : {};
  const state = (intake.state || "").toLowerCase();

  const steps = state.includes("texas")
    ? ["Go to eFileTexas.gov", "Sign up or log in", "Select your county and upload your motion", "Pay the filing fee"]
    : ["Visit your county clerk website", "Download or print your document", "File in person or by mail"];

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow rounded-xl p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-4">How to File Your Document</h1>
        <ol className="list-decimal pl-6 space-y-2 text-gray-700">{steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
        <p className="mt-6 text-gray-500 text-sm">If unsure, call your local clerk for confirmation before submitting.</p>
      </div>
    </main>
  );
}
