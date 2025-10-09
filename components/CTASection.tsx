import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-20 bg-blue-600 text-white text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to File Your Motion?</h2>
      <p className="mb-8 text-lg">Upload your legal document and let our AI handle the rest in minutes.</p>
      <Link href="/upload-motion" className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-md shadow hover:bg-gray-100 transition">
        Start Now
      </Link>
    </section>
  );
}
