
export function favouritesReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_FAVOURITE': {
      const alreadyFavourite = state.includes(action.photoId)

      if (alreadyFavourite) {
        return state.filter((id) => id !== action.photoId)
      }

      return [...state, action.photoId]
    }

    default:
      return state
  }
}

export function loadFavourites() {
  try {
    const saved = localStorage.getItem('celebrare-favourites')

    if (!saved) return []

    const parsed = JSON.parse(saved)

    return Array.isArray(parsed)
      ? parsed.filter((id) => typeof id === 'string' || typeof id === 'number')
      : []
  } catch {
    return []
  }
}
