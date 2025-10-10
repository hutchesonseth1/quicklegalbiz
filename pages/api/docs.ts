import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/vaultSupabase'

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await supabaseAdmin
    .from('documents')
    .select('id,title,fileUrl,status,signedUrl,createdAt')
    .order('createdAt', { ascending: false })
    .limit(50)
  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json({ docs: data ?? [] })
}
