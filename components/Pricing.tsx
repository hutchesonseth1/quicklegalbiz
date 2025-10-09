export default function Pricing() {
  const plans = [
    { title: "Starter", price: "$49", desc: "Simple filing support and document review", features: ["AI motion analysis", "Downloadable checklist", "Email support"] },
    { title: "Pro", price: "$149", desc: "Full service and direct motion generation", features: ["All Starter features", "AI-generated legal drafts", "Priority response"] },
    { title: "Enterprise", price: "Custom", desc: "Tailored for firms and high-volume cases", features: ["API integration", "Dedicated support", "Bulk motion management"] },
  ];

  return (
    <section id="pricing" className="py-16 bg-gray-50 text-center">
      <h2 className="text-4xl font-bold mb-8 text-gray-800">Pricing Plans</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div key={plan.title} className="bg-white border shadow-sm rounded-lg p-8">
            <h3 className="text-2xl font-semibold mb-2">{plan.title}</h3>
            <p className="text-gray-600 mb-4">{plan.desc}</p>
            <p className="text-4xl font-bold mb-6 text-blue-600">{plan.price}</p>
            <ul className="text-left mb-6 space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center space-x-2">
                  <span>✅</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <a href="/upload-motion" className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
              Get Started
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
