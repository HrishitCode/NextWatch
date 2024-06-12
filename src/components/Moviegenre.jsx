import React, { useState, useEffect } from "react";

const fetchMoviesByGenre = async (genreId) => {
  const movieUrl = `https://api.themoviedb.org/3/discover/movie?language=en&with_genres=${genreId}`;
  const movieOptions = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NmRjOGQ1OWVkNTVhNTMxZTYwMjk5YzMwYjUxMjdlNiIsInN1YiI6IjY1ZTRiMTYwOTk3OWQyMDE3Y2IyOWRhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qBFYp1I62IBsHk461pbpTC7eapxnXM02dvD0aAcIUAU'
    }
  };

  try {
    const response = await fetch(movieUrl, movieOptions);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log(data);
    return data.results;
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
  }
};

const Moviegenre = ({ genreId }) => {
  console.log('here : ', genreId);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviesData = await fetchMoviesByGenre(genreId);
        setMovies(moviesData);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, [genreId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="grid grid-cols-4">
      {movies.length > 0 &&
        movies.map(movie => (
          <div key={movie.id}>
            <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} alt={movie.title} />
          </div>
        ))
      }
    </div>
  );
};

export default Moviegenre;
