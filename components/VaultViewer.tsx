'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface Doc {
  id: string
  title: string
  form_type: string
  file_url: string
  created_at: string
}

export default function VaultViewer() {
  const [docs, setDocs] = useState<Doc[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDocs() {
      const { data, error } = await supabase
        .from('vault_documents')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) console.error('Error fetching docs:', error)
      else setDocs(data || [])
      setLoading(false)
    }

    fetchDocs()

    // Real-time updates for new docs
    const subscription = supabase
      .channel('vault_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'vault_documents' },
        (payload) => {
          console.log('Change received:', payload)
          fetchDocs()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  if (loading) return <p>Loading documents...</p>

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h3 className="text-lg font-semibold mb-2">My Documents</h3>

      {docs.length === 0 && <p>No documents yet.</p>}

      <table className="min-w-full text-left border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-2 py-1">Title</th>
            <th className="border border-gray-300 px-2 py-1">Form Type</th>
            <th className="border border-gray-300 px-2 py-1">Date</th>
            <th className="border border-gray-300 px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody>
          {docs.map((doc) => (
            <tr key={doc.id}>
              <td className="border border-gray-300 px-2 py-1">{doc.title}</td>
              <td className="border border-gray-300 px-2 py-1">{doc.form_type}</td>
              <td className="border border-gray-300 px-2 py-1">
                {new Date(doc.created_at).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 px-2 py-1">
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View / Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}