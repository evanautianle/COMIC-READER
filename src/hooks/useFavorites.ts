import { useEffect, useState } from 'react'
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

type UseFavoritesResult = {
  favorites: FavoriteRow[]
  error: string | null
}

export default function useFavorites(): UseFavoritesResult {
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

      const { data, error: favoritesError } = await supabase
        .from('favorites')
        .select('id, created_at, comic:comics(id, title, cover_url)')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false })

      if (favoritesError) {
        setError(favoritesError.message)
        return
      }

      setFavorites(data ?? [])
    }

    fetchFavorites()
  }, [])

  return { favorites, error }
}
