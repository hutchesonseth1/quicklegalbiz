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
