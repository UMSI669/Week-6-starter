// Convert raw TMDB responses into the smaller shapes our screens use, so
// components never need to know TMDB's field names.
// Read TMDB data and pass it 
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const PLACEHOLDER_POSTER = 'https://placehold.co/200x300/171923/ffffff?text=MOVIEwiki';

function imageUrl(path, size) {
  return path ? `${IMAGE_BASE_URL}/${size}${path}` : null;
}

function formatRuntime(minutes) {
  if (!minutes) {
    return '';
  }
  const hours = Math.floor(minutes / 60);
  return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
}

// A movie as it appears in lists (search, discover, trending, ...).
export function toMovieSummary(tmdbMovie) {
  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title,
    year: tmdbMovie.release_date?.slice(0, 4) || '—',
    releaseDate: tmdbMovie.release_date || '',
    rating: tmdbMovie.vote_average || 0,
    genreIds: tmdbMovie.genre_ids || tmdbMovie.genres?.map((genre) => genre.id) || [],
    poster: imageUrl(tmdbMovie.poster_path, 'w500') || PLACEHOLDER_POSTER,
    overview: tmdbMovie.overview || '',
  };
}

// A paged list response, e.g. GET /search/movie.
export function toMoviePage(response) {
  return {
    page: response.page,
    totalPages: response.total_pages,
    movies: response.results.map(toMovieSummary),
  };
}

// GET /movie/{id}?append_to_response=credits,reviews,recommendations
export function toMovieDetails(response) {
  return {
    ...toMovieSummary(response),
    backdrop: imageUrl(response.backdrop_path, 'w780'),
    runtime: formatRuntime(response.runtime),
    genres: response.genres.map((genre) => genre.name),
    cast: (response.credits?.cast || []).slice(0, 8).map((person) => ({
      id: person.id,
      name: person.name,
      character: person.character,
      photo: imageUrl(person.profile_path, 'w185'),
    })),
    reviews: (response.reviews?.results || []).slice(0, 3).map((review) => ({
      id: review.id,
      author: review.author,
      content: review.content,
    })),
    recommendations: (response.recommendations?.results || [])
      .slice(0, 6)
      .map(toMovieSummary),
  };
}
