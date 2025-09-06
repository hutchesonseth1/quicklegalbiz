'use client';

import { useState } from 'react';

export default function CheckoutButton({ priceId }: { priceId: string }) {
  const [loading, setLoading] = useState(false);

  async function onClick() {
    try {
      setLoading(true);
      const r = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const { url } = await r.json();
      if (url) window.location.href = url;
      else throw new Error('Missing session URL');
    } catch (e) {
      console.error(e);
      alert('Unable to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button disabled={loading} onClick={onClick}>
      {loading ? 'Redirecting…' : 'Checkout'}
    </button>
  );
}
