import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

// Define comic & Chapeter types
type Comic = {
  id: string
  title: string
  author: string | null
  description: string | null
  cover_url: string | null
}

type Chapter = {
  id: string
  title: string | null
  number: number | null
}

// Display comic details and list of chapters
export default function ComicDetail() {
  const { id } = useParams()

  // 3 states for comic details, chapters, and error handling
  const [comic, setComic] = useState<Comic | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [favoriteId, setFavoriteId] = useState<number | null>(null)
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser()

      if (userError) {
        setError(userError.message)
        return
      }

      setUserId(userData.user?.id ?? null)

      const { data: comicData, error: comicError } = await supabase
        .from('comics')
        .select('id, title, author, description, cover_url')
        .eq('id', id)
        .single()

      if (comicError) {
        setError(comicError.message)
        return
      }

      const { data: chapterData, error: chapterError } = await supabase
        .from('chapters')
        .select('id, title, number')
        .eq('comic_id', id)
        .order('number', { ascending: true })

      if (chapterError) {
        setError(chapterError.message)
        return
      }

      setComic(comicData)
      setChapters(chapterData ?? [])
    }

    fetchData()
  }, [id])

  useEffect(() => {
    if (!id || !userId) return

    const fetchFavorite = async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('comic_id', id)
        .eq('user_id', userId)
        .maybeSingle<{ id: number }>()

      if (error) {
        setError(error.message)
        return
      }

      setFavoriteId(data?.id ?? null)
    }

    fetchFavorite()
  }, [id, userId])

  const handleFavoriteToggle = async () => {
    if (!id || !userId) return

    setFavoriteLoading(true)
    setError(null)

    if (favoriteId) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId)

      if (error) {
        setError(error.message)
      } else {
        setFavoriteId(null)
      }
    } else {
      const { data, error } = await supabase
        .from('favorites')
        .insert({ comic_id: id, user_id: userId })
        .select('id')
        .single<{ id: number }>()

      if (error) {
        setError(error.message)
      } else {
        setFavoriteId(data.id)
      }
    }

    setFavoriteLoading(false)
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <Link to="/" className="text-xs text-neutral-400 hover:text-neutral-200">
        Back to browse
      </Link>

      {error ? (
        <div className="mt-4 text-sm text-red-400">{error}</div>
      ) : null}

      {comic ? (
        <div className="mt-4 grid gap-6 md:grid-cols-[240px,1fr]">
          <div className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
            {comic.cover_url ? (
              <img
                src={comic.cover_url}
                alt={comic.title}
                className="h-80 w-full object-cover"
              />
            ) : (
              <div className="flex h-80 items-center justify-center bg-neutral-800 text-xs text-neutral-400">
                No cover
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                {comic.title}
              </h1>
              <button
                type="button"
                onClick={handleFavoriteToggle}
                disabled={favoriteLoading}
                className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-medium text-neutral-200 transition hover:border-neutral-700 disabled:opacity-50"
              >
                {favoriteId ? 'Remove favorite' : 'Add to favorites'}
              </button>
            </div>
            {comic.author ? (
              <p className="mt-2 text-sm text-neutral-400">
                {comic.author}
              </p>
            ) : null}
            {comic.description ? (
              <p className="mt-4 text-sm text-neutral-300">
                {comic.description}
              </p>
            ) : null}

            <div className="mt-6">
              <h2 className="text-sm font-semibold text-neutral-200">Chapters</h2>
              <div className="mt-2 grid gap-2">
                {chapters.map((chapter) => (
                  <Link
                    key={chapter.id}
                    to={`/reader/${chapter.id}`}
                    className="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 hover:border-neutral-700"
                  >
                    <span>
                      {chapter.number ? `Chapter ${chapter.number}` : 'Chapter'}
                      {chapter.title ? ` · ${chapter.title}` : ''}
                    </span>
                    <span className="text-xs text-neutral-400">Read</span>
                  </Link>
                ))}
                {chapters.length === 0 ? (
                  <div className="text-xs text-neutral-400">
                    No chapters yet.
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
