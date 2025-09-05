export default function HowItWorks() {
  const steps = [
    { title: '1. Talk to the assistant', desc: 'Answer a few questions in plain language. No legal jargon needed.' },
    { title: '2. Pay a small fee', desc: 'Just $5 to $10 to prepare your form. Preview it before paying full.' },
    { title: '3. Get your form & help', desc: 'Download the PDF, get filing tips, and ask follow-up questions anytime.' },
  ];

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">How it works</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((step, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-6 text-center space-y-2">
            <h3 className="text-lg font-medium">{step.title}</h3>
            <p className="text-sm text-gray-600">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
