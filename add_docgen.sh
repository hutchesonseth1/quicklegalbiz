#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────────────────
# QuickLegalBiz – Web Doc Generator + Signer (Pages Router)
# Adds:
#  - /pages/dashboard/doc-generator.tsx
#  - /components/SignModal.tsx
#  - /components/DocList.tsx
#  - /pages/api/upload.ts
#  - /pages/api/vault/ingest.ts
#  - /pages/api/docs.ts
#  - /lib/vaultSupabase.ts (server-side client)
# Installs: pdf-lib signature_pad form-data
# ─────────────────────────────────────────────────────────────

ROOT="$(pwd)"
if [ ! -f "$ROOT/package.json" ] || [ ! -d "$ROOT/pages" ]; then
  echo "Run this script from your quicklegalbiz project root (where package.json lives)."
  exit 1
fi

echo "→ Installing dependencies…"
# use npm because your project shows package-lock.json; if you prefer yarn: swap commands
npm i pdf-lib signature_pad form-data

mkdir -p components pages/dashboard pages/api/vault lib

# ── lib/vaultSupabase.ts ─────────────────────────────────────
cat > lib/vaultSupabase.ts <<'TS'
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const VAULT_BUCKET = process.env.NEXT_PUBLIC_VAULT_BUCKET || 'vault'
TS

# ── components/SignModal.tsx ─────────────────────────────────
cat > components/SignModal.tsx <<'TSX'
import React, { useEffect, useRef, useState } from 'react'
import SignaturePad from 'signature_pad'
import { PDFDocument } from 'pdf-lib'

type Props = {
  open: boolean
  onClose: () => void
  file: File | null
  onSigned: (signedFile: File) => void
}

export default function SignModal({ open, onClose, file, onSigned }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const padRef = useRef<SignaturePad | null>(null)
  const [placing, setPlacing] = useState(false)
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    const c = canvasRef.current
    if (!c) return
    const pad = new SignaturePad(c, { backgroundColor: 'rgba(255,255,255,0)', penColor: '#111' })
    padRef.current = pad
    const resize = () => {
      const w = Math.min(600, window.innerWidth - 80)
      const h = 180
      c.width = w * devicePixelRatio
      c.height = h * devicePixelRatio
      c.style.width = w + 'px'
      c.style.height = h + 'px'
      const ctx = c.getContext('2d')!
      ctx.scale(devicePixelRatio, devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => { window.removeEventListener('resize', resize); pad.off() }
  }, [open])

  async function handlePlaceSignature(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    if (!file || !padRef.current) return
    // export signature as PNG
    const dataUrl = padRef.current.isEmpty() ? null : padRef.current.toDataURL('image/png')
    if (!dataUrl) { alert('Please draw or upload a signature first'); return }
    setPreviewDataUrl(dataUrl)
    setPlacing(true)
  }

  async function finalizeSign(position: { xPct: number; yPct: number; scale: number }) {
    if (!file || !previewDataUrl) return
    const pdfBytes = await file.arrayBuffer()
    const doc = await PDFDocument.load(pdfBytes)
    const pages = doc.getPages()
    const page = pages[pages.length - 1] // place on last page by default

    const pngBytes = await (await fetch(previewDataUrl)).arrayBuffer()
    const png = await doc.embedPng(pngBytes)
    const { width, height } = page.getSize()
    const w = png.width * position.scale
    const h = png.height * position.scale
    const x = width * position.xPct - w / 2
    const y = height * position.yPct - h / 2

    page.drawImage(png, { x, y, width: w, height: h })
    const stamped = await doc.save()
    const out = new File([stamped], file.name.replace(/\.pdf$/i, '_signed.pdf'), { type: 'application/pdf' })
    onSigned(out)
    onClose()
  }

  function handleUploadSig(ev: React.ChangeEvent<HTMLInputElement>) {
    const f = ev.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => setPreviewDataUrl(reader.result as string)
    reader.readAsDataURL(f)
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Sign Document</h2>
          <button className="text-sm text-gray-600" onClick={onClose}>Close</button>
        </div>

        {!placing ? (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Draw signature</label>
              <canvas ref={canvasRef} className="border rounded w-full" />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm">or Upload PNG/SVG: </label>
              <input type="file" accept="image/png,image/svg+xml" onChange={handleUploadSig} />
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="px-3 py-2 bg-gray-100 rounded"
                onClick={() => padRef.current?.clear()}>
                Clear
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handlePlaceSignature}>
                Place on document
              </button>
            </div>
          </>
        ) : (
          <PlaceOverlay onConfirm={finalizeSign} previewUrl={previewDataUrl!} />
        )}
      </div>
    </div>
  )
}

function PlaceOverlay({ onConfirm, previewUrl }: { onConfirm: (p:{xPct:number;yPct:number;scale:number})=>void, previewUrl: string }) {
  const [xPct, setX] = useState(0.85)
  const [yPct, setY] = useState(0.08)
  const [scale, setScale] = useState(0.35)
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Choose approximate position (percent from left/bottom) and size, then confirm.
      </p>
      <div className="grid grid-cols-3 gap-4">
        <label className="text-sm">X%<input type="range" min="0.05" max="0.95" step="0.01" value={xPct}
          onChange={e=>setX(parseFloat(e.target.value))} /></label>
        <label className="text-sm">Y%<input type="range" min="0.05" max="0.95" step="0.01" value={yPct}
          onChange={e=>setY(parseFloat(e.target.value))} /></label>
        <label className="text-sm">Scale<input type="range" min="0.15" max="0.75" step="0.01" value={scale}
          onChange={e=>setScale(parseFloat(e.target.value))} /></label>
      </div>
      <div className="flex items-center gap-3">
        <img src={previewUrl} alt="sig" className="h-12 object-contain border rounded bg-white" />
        <button className="ml-auto px-4 py-2 bg-blue-600 text-white rounded"
          onClick={()=>onConfirm({ xPct, yPct, scale })}>
          Confirm placement
        </button>
      </div>
    </div>
  )
}
TSX

# ── components/DocList.tsx ───────────────────────────────────
cat > components/DocList.tsx <<'TSX'
import React from 'react'

export type DocRow = {
  id: string
  title: string
  fileUrl: string
  status: string
  createdAt: string
  signedUrl?: string | null
}

export default function DocList({ docs, onRefresh }:{docs:DocRow[], onRefresh:()=>void}) {
  return (
    <div className="space-y-2">
      {docs.map(d => (
        <div key={d.id} className="flex items-center gap-3 border rounded p-3">
          <div className="font-medium">{d.title}</div>
          <div className="text-xs text-gray-500">status: {d.status}</div>
          <a className="text-blue-600 text-sm" href={d.signedUrl ?? d.fileUrl} target="_blank">download</a>
          <button className="ml-auto text-sm px-3 py-1 bg-gray-100 rounded" onClick={onRefresh}>refresh</button>
        </div>
      ))}
      {docs.length === 0 && <div className="text-sm text-gray-500">No documents yet.</div>}
    </div>
  )
}
TSX

# ── pages/dashboard/doc-generator.tsx ────────────────────────
cat > pages/dashboard/doc-generator.tsx <<'TSX'
import React, { useEffect, useState } from 'react'
import SignModal from '@/components/SignModal'
import DocList, { DocRow } from '@/components/DocList'

export default function DocGeneratorPage() {
  const [file, setFile] = useState<File | null>(null)
  const [showSign, setShowSign] = useState(false)
  const [docs, setDocs] = useState<DocRow[]>([])
  const [title, setTitle] = useState('Untitled Document')
  const [formType, setFormType] = useState('Motion')
  const [caseNumber, setCaseNumber] = useState('')
  const [county, setCounty] = useState('')
  const [dateStr, setDateStr] = useState(new Date().toISOString().slice(0,10))
  const [status, setStatus] = useState<string>('')

  async function refreshDocs() {
    const res = await fetch('/api/docs')
    const data = await res.json()
    setDocs(data.docs || [])
  }

  useEffect(() => { refreshDocs() }, [])

  async function handleUploadFinal(f: File) {
    setStatus('Uploading…')
    const fd = new FormData()
    fd.append('file', f)
    fd.append('title', title || f.name)
    fd.append('form_type', formType)
    fd.append('case_number', caseNumber)
    fd.append('jurisdiction', county)
    try {
      const up = await fetch('/api/upload', { method: 'POST', body: fd })
      const upJson = await up.json()
      if (up.ok) {
        // insert metadata row
        const ing = await fetch('/api/vault/ingest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title, fileUrl: upJson.publicUrl, formType, caseNumber, county
          })
        })
        if (!ing.ok) throw new Error('ingest failed')
        setStatus('Saved to Vault.')
        await refreshDocs()
      } else {
        throw new Error(upJson.error || 'upload failed')
      }
    } catch (e:any) {
      console.error(e)
      setStatus('Error: ' + e.message)
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Document Generator</h1>

      <section className="space-y-3 border rounded p-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">Title
            <input className="w-full border rounded px-2 py-1" value={title} onChange={e=>setTitle(e.target.value)} />
          </label>
          <label className="text-sm">Form Type
            <select className="w-full border rounded px-2 py-1" value={formType} onChange={e=>setFormType(e.target.value)}>
              <option>Motion</option><option>Affidavit</option>
              <option>Subpoena</option><option>Notice</option>
              <option>Certification</option>
            </select>
          </label>
          <label className="text-sm">Case #
            <input className="w-full border rounded px-2 py-1" value={caseNumber} onChange={e=>setCaseNumber(e.target.value)} />
          </label>
          <label className="text-sm">County
            <input className="w-full border rounded px-2 py-1" value={county} onChange={e=>setCounty(e.target.value)} />
          </label>
          <label className="text-sm">Date
            <input type="date" className="w-full border rounded px-2 py-1" value={dateStr} onChange={e=>setDateStr(e.target.value)} />
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input type="file" accept="application/pdf" onChange={e=>setFile(e.target.files?.[0] || null)} />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            disabled={!file}
            onClick={()=>setShowSign(true)}>
            Sign & Finalize
          </button>
          <div className="text-sm text-gray-600">{status}</div>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">My Documents</h2>
        <DocList docs={docs} onRefresh={refreshDocs} />
      </section>

      <SignModal
        open={showSign}
        onClose={()=>setShowSign(false)}
        file={file}
        onSigned={(signed)=>handleUploadFinal(signed)}
      />
    </main>
  )
}
TSX

# ── pages/api/upload.ts ──────────────────────────────────────
cat > pages/api/upload.ts <<'TS'
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin, VAULT_BUCKET } from '@/lib/vaultSupabase'

export const config = { api: { bodyParser: false } }

function parseForm(req: NextApiRequest) {
  return new Promise<{fields:Record<string,string>, file:Buffer, filename:string, contentType:string}>((resolve, reject) => {
    const busboy = require('busboy')
    const bb = busboy({ headers: req.headers })
    const fields: Record<string,string> = {}
    let fileBuffer: Buffer | null = null
    let filename = 'upload.pdf'
    let contentType = 'application/pdf'
    bb.on('file', (_name: string, stream: any, info: any) => {
      filename = info.filename || filename
      contentType = info.mimeType || contentType
      const chunks: Buffer[] = []
      stream.on('data', (d:Buffer)=>chunks.push(d))
      stream.on('end', ()=> fileBuffer = Buffer.concat(chunks))
    })
    bb.on('field', (name:string, val:string)=> fields[name]=val)
    bb.on('error', reject)
    bb.on('close', ()=> fileBuffer ? resolve({ fields, file: fileBuffer!, filename, contentType }) : reject(new Error('no file')) )
    req.pipe(bb)
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { file, filename, contentType } = await parseForm(req)
    const key = `original/${Date.now()}-${filename.replace(/\s+/g,'_')}`
    const { error } = await supabaseAdmin.storage.from(VAULT_BUCKET).upload(key, file, { contentType, upsert: false })
    if (error) return res.status(500).json({ error: error.message })
    const { data } = supabaseAdmin.storage.from(VAULT_BUCKET).getPublicUrl(key)
    return res.status(200).json({ key, publicUrl: data.publicUrl })
  } catch (e:any) {
    return res.status(400).json({ error: e.message })
  }
}
TS

# ── pages/api/vault/ingest.ts ────────────────────────────────
cat > pages/api/vault/ingest.ts <<'TS'
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/vaultSupabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { title, fileUrl, formType, caseNumber, county } = req.body || {}
    if (!fileUrl) return res.status(400).json({ error: 'missing fileUrl' })
    const { error } = await supabaseAdmin.from('documents').insert({
      title: title || 'Untitled',
      fileUrl,
      status: 'final',
      form_type: formType ?? null,
      case_number: caseNumber ?? null,
      jurisdiction: county ?? null,
    })
    if (error) return res.status(500).json({ error: error.message })
    res.status(200).json({ ok: true })
  } catch (e:any) {
    res.status(400).json({ error: e.message })
  }
}
TS

# ── pages/api/docs.ts ────────────────────────────────────────
cat > pages/api/docs.ts <<'TS'
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
TS

echo "→ Done. Files added."

# ── env hints ────────────────────────────────────────────────
if ! grep -q "SUPABASE_SERVICE_ROLE_KEY" .env.local 2>/dev/null; then
  cat >> .env.local <<'ENV'

# ─── DocGen/Vault (add your real values) ─────────────────────
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role>
NEXT_PUBLIC_VAULT_BUCKET=vault
ENV
  echo "→ Appended env placeholders to .env.local"
fi

echo "→ Make sure a Supabase table 'documents' exists with at least columns:"
echo "   id (uuid default uuid_generate_v4 or text), title text, fileUrl text,"
echo "   status text, signedUrl text, createdAt timestamp default now(),"
echo "   form_type text, case_number text, jurisdiction text"
echo "   (You can add these via Supabase Table Editor quickly)."

echo "→ Start dev: npm run dev  →  open http://localhost:3000/dashboard/doc-generator"