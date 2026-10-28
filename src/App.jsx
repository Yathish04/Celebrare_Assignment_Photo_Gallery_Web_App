
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react'

import useFetchPhotos from './hooks/useFetchPhotos'
import {
  favouritesReducer,
  loadFavourites,
} from './reducers/favouritesReducer'

function App() {
  const { photos, loading, error } = useFetchPhotos()

  const [search, setSearch] = useState('')

  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    undefined,
    loadFavourites
  )

  useEffect(() => {
    try {
      localStorage.setItem(
        'celebrare-favourites',
        JSON.stringify(favourites)
      )
    } catch (error) {
      console.error('Could not save favourites:', error)
    }
  }, [favourites])

  const handleSearch = useCallback((event) => {
    setSearch(event.target.value)
  }, [])

  const toggleFavourite = useCallback((photoId) => {
    dispatch({
      type: 'TOGGLE_FAVOURITE',
      photoId,
    })
  }, [])

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(search.toLowerCase())
    )
  }, [photos, search])

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 text-center">
          <h1 className="mb-3 text-4xl font-bold text-gray-900">
            Photo Gallery
          </h1>

          <p className="text-gray-600">
            Discover beautiful photos from talented photographers.
          </p>
        </header>

        <div className="mb-8">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search photos by author..."
            aria-label="Search photos by author"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
        </div>

        <p className="mb-5 text-sm text-gray-600">
          {favourites.length} favourite
          {favourites.length === 1 ? '' : 's'} saved
        </p>

        {loading && (
          <div className="flex flex-col items-center py-20">
            <div
              className="h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"
              role="status"
              aria-label="Loading photos"
            />
            <p className="mt-4 text-gray-600">Loading photos...</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl bg-red-50 p-6 text-center text-red-700">
            Unable to load photos: {error}
          </div>
        )}

        {!loading && !error && filteredPhotos.length === 0 && (
          <p className="py-12 text-center text-gray-600">
            No photos found for "{search}".
          </p>
        )}

        {!loading && !error && filteredPhotos.length > 0 && (
          <section
            aria-label="Photo gallery"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {filteredPhotos.map((photo) => {
              const isFavourite = favourites.includes(photo.id)

              return (
                <article
                  key={photo.id}
                  className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-lg"
                >
                  <img
                    src={`https://picsum.photos/id/${photo.id}/500/350`}
                    alt={`Photo by ${photo.author}`}
                    loading="lazy"
                    className="h-56 w-full object-cover"
                  />

                  <div className="flex items-center justify-between gap-3 p-4">
                    <p className="truncate font-medium text-gray-800">
                      {photo.author}
                    </p>

                    <button
                      type="button"
                      onClick={() => toggleFavourite(photo.id)}
                      aria-label={
                        isFavourite
                          ? `Remove ${photo.author} photo from favourites`
                          : `Add ${photo.author} photo to favourites`
                      }
                      aria-pressed={isFavourite}
                      className={`shrink-0 rounded-full p-2 transition-colors ${
                        isFavourite
                          ? 'text-red-500'
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={isFavourite ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
                        />
                      </svg>
                    </button>
                  </div>
                </article>
              )
            })}
          </section>
        )}

        {!loading && !error && filteredPhotos.length > 0 && (
          <p className="mt-6 text-center text-sm text-gray-500">
            Showing {filteredPhotos.length} of {photos.length} photos
          </p>
        )}
      </div>
    </main>
  )
}

export default App
