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
