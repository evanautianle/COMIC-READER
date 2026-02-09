import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

type Page = {
  id: string
  page_number: number | null
  image_url: string | null
}

export default function Reader() {
  const { chapterId } = useParams()
  const [pages, setPages] = useState<Page[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!chapterId) return

    const fetchPages = async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('id, page_number, image_url')
        .eq('chapter_id', chapterId)
        .order('page_number', { ascending: true })

      if (error) {
        setError(error.message)
        return
      }

      setPages(data ?? [])
      setCurrentIndex(0)
    }

    fetchPages()
  }, [chapterId])

  const currentPage = pages[currentIndex]

  return (
    <div className="mx-auto max-w-5xl px-6 py-6">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-xs text-neutral-400 hover:text-neutral-200">
          Back to browse
        </Link>
        <span className="text-xs text-neutral-500">
          Page {pages.length ? currentIndex + 1 : 0} / {pages.length}
        </span>
      </div>

      {error ? (
        <div className="mt-4 text-sm text-red-400">{error}</div>
      ) : null}

      <div className="mt-4 flex items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 p-4">
        {currentPage?.image_url ? (
          <img
            src={currentPage.image_url}
            alt={`Page ${currentIndex + 1}`}
            className="max-h-[80vh] w-auto rounded-md"
          />
        ) : (
          <div className="py-16 text-sm text-neutral-400">No pages found.</div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentIndex === 0}
          className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-neutral-200 disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() =>
            setCurrentIndex((prev) => Math.min(prev + 1, pages.length - 1))
          }
          disabled={currentIndex >= pages.length - 1}
          className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-neutral-200 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  )
}
