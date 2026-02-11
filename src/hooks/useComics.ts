import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type Comic = {
  id: string
  title: string
  cover_url: string | null
}

type UseComicsResult = {
  comics: Comic[]
  error: string | null
}

export default function useComics(): UseComicsResult {
  const [comics, setComics] = useState<Comic[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchComics = async () => {
      const { data, error: comicsError } = await supabase
        .from('comics')
        .select('id, title, cover_url')
        .order('title')

      if (comicsError) {
        setError(comicsError.message)
        return
      }

      setComics(data ?? [])
    }

    fetchComics()
  }, [])

  return { comics, error }
}
