export default function handler(req, res) {
  res.status(200).json({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'undefined',
    roleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'OK' : 'MISSING',
    anonKey: process.env.SUPABASE_ANON_KEY ? 'OK' : 'MISSING',
  });
}