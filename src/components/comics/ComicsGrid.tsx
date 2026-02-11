import ComicCard from './ComicCard'

type Comic = {
  id: string
  title: string
  cover_url: string | null
  coming_soon: boolean | null
}

type ComicsGridProps = {
  comics: Comic[]
}

export default function ComicsGrid({ comics }: ComicsGridProps) {
  const availableComics = comics.filter((comic) => comic.coming_soon !== true)
  const comingSoonComics = comics.filter((comic) => comic.coming_soon === true)

  return (
    <div className="mt-6 space-y-8">
      <section>
        <h2 className="text-lg font-semibold">Available Comics</h2>
        <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
          {availableComics.map((comic) => (
            <ComicCard
              key={comic.id}
              id={comic.id}
              title={comic.title}
              coverUrl={comic.cover_url}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Coming Soon</h2>
        <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
          {comingSoonComics.map((comic) => (
            <ComicCard
              key={comic.id}
              id={comic.id}
              title={comic.title}
              coverUrl={comic.cover_url}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
