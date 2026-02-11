import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

type FavoriteRow = {
  id: number
  created_at: string
  comic: {
    id: string
    title: string
    cover_url: string | null
  } | null
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteRow[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFavorites = async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser()

      if (userError || !userData.user) {
        setError(userError?.message ?? 'Sign in required.')
        return
      }

      const { data, error } = await supabase
        .from('favorites')
        .select('id, created_at, comic:comics(id, title, cover_url)')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
        return
      }

      setFavorites(data ?? [])
    }

    fetchFavorites()
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-xs text-neutral-400 hover:text-neutral-200">
          Back to browse
        </Link>
        <span className="text-xs text-neutral-500">Your favorites</span>
      </div>

      {error ? <div className="mt-4 text-sm text-red-400">{error}</div> : null}

      <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
        {favorites.map((favorite) =>
          favorite.comic ? (
            <Link
              key={favorite.id}
              to={`/comic/${favorite.comic.id}`}
              className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 transition hover:border-neutral-700"
            >
              {favorite.comic.cover_url ? (
                <img
                  src={favorite.comic.cover_url}
                  alt={favorite.comic.title}
                  className="h-70 w-full object-cover"
                />
              ) : (
                <div className="flex h-70 items-center justify-center bg-neutral-800 text-xs text-neutral-400">
                  No cover
                </div>
              )}
              <div className="px-3 py-2">
                <div className="text-sm font-semibold">
                  {favorite.comic.title}
                </div>
              </div>
            </Link>
          ) : null,
        )}
      </div>

      {favorites.length === 0 && !error ? (
        <div className="mt-6 text-sm text-neutral-400">
          No favorites yet.
        </div>
      ) : null}
    </div>
  )
}
