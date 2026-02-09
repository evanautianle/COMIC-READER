import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

type Comic = {
  id: string
  title: string
  cover_url: string | null
}

export default function Home() {
  const [comics, setComics] = useState<Comic[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('comics')
        .select('id, title, cover_url')
        .order('title')

      if (error) {
        setError(error.message)
        return
      }

      setComics(data ?? [])
    }

    fetchData()
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Comic Reader</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Browse your uploaded comics
          </p>
        </div>
        <span className="text-xs text-neutral-500">Supabase Connected</span>
      </div>

      {error ? (
        <div className="mt-4 text-sm text-red-400">{error}</div>
      ) : null}

      <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
        {comics.map((comic) => (
          <Link
            key={comic.id}
            to={`/comic/${comic.id}`}
            className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 transition hover:border-neutral-700"
          >
            {comic.cover_url ? (
              <img
                src={comic.cover_url}
                alt={comic.title}
                className="h-70 w-full object-cover"
              />
            ) : (
              <div className="flex h-70 items-center justify-center bg-neutral-800 text-xs text-neutral-400">
                No cover
              </div>
            )}
            <div className="px-3 py-2">
              <div className="text-sm font-semibold">{comic.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
