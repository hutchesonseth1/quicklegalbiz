export const runtime = 'nodejs'
import type { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe';

type Body = {
  priceId: string;
  quantity?: number;
  successUrl?: string;
  cancelUrl?: string;
  customerEmail?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { priceId, quantity = 1, successUrl, cancelUrl, customerEmail } = req.body as Body;

    if (!priceId) return res.status(400).json({ error: 'Missing priceId' });

    const origin =
      (req.headers['x-forwarded-proto'] && req.headers.host)
        ? `${req.headers['x-forwarded-proto']}://${req.headers.host}`
        : `http://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity }],
      success_url: successUrl ?? `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl ?? `${origin}/cancel`,
      customer_email: customerEmail,
      automatic_tax: { enabled: true },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('[checkout] failed:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
