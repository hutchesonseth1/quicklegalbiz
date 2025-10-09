import { useState } from "react";

export default function TestEmail() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("AI Legal Fix Test Email");
  const [message, setMessage] = useState("This is a test email from your app.");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to,
          subject,
          text: message,
        }),
      });

      if (res.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">📧 Test Email Sender</h1>

      <form
        onSubmit={sendEmail}
        className="bg-zinc-900 p-6 rounded-xl w-full max-w-md space-y-4"
      >
        <input
          type="email"
          placeholder="Recipient email address"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
          className="w-full p-2 rounded bg-zinc-800 text-white placeholder-zinc-500"
        />

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className="w-full p-2 rounded bg-zinc-800 text-white placeholder-zinc-500"
        />

        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          required
          className="w-full p-2 rounded bg-zinc-800 text-white placeholder-zinc-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 w-full py-2 rounded font-semibold disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Test Email"}
        </button>

        {status === "sent" && (
          <p className="text-emerald-400 text-center mt-2">
            ✅ Email sent successfully!
          </p>
        )}
        {status === "error" && (
          <p className="text-red-400 text-center mt-2">
            ❌ Failed to send email.
          </p>
        )}
      </form>
    </main>
  );
}