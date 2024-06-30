import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Directors = () => {
  const location = useLocation();
  const { directorID, directorName: initialDirectorName, user } = location.state;
  const [directorName, setDirectorName] = useState(initialDirectorName);
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  const getName = async (directorID) => {
    const moviesUrl = `https://api.themoviedb.org/3/person/${directorID}`;
    try {
      const response = await fetch(moviesUrl, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NmRjOGQ1OWVkNTVhNTMxZTYwMjk5YzMwYjUxMjdlNiIsInN1YiI6IjY1ZTRiMTYwOTk3OWQyMDE3Y2IyOWRhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qBFYp1I62IBsHk461pbpTC7eapxnXM02dvD0aAcIUAU'
        }
      });
      const result = await response.json();
      setDirectorName(result.name);
    } catch (error) {
      console.error('Error fetching director movies:', error);
    }
  };

  const fetchDirectorMovies = async (directorID) => {
    const moviesUrl = `https://api.themoviedb.org/3/person/${directorID}/movie_credits`;
    try {
      const response = await fetch(moviesUrl, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NmRjOGQ1OWVkNTVhNTMxZTYwMjk5YzMwYjUxMjdlNiIsInN1YiI6IjY1ZTRiMTYwOTk3OWQyMDE3Y2IyOWRhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qBFYp1I62IBsHk461pbpTC7eapxnXM02dvD0aAcIUAU'
        }
      });
      const result = await response.json();
      
      // Combine cast and crew into a single array
      const allMovies = [...result.cast, ...result.crew];
      // Remove duplicates by using a Map
      const uniqueMovies = Array.from(new Map(allMovies.map(movie => [movie.id, movie])).values());
      
      setMovies(uniqueMovies);
    } catch (error) {
      console.error('Error fetching director movies:', error);
    }
  };

  useEffect(() => {
    getName(directorID);
    fetchDirectorMovies(directorID);
  }, [directorID]);

  const onMovieClick = (movie) => {
    const encodedTitle = encodeURIComponent(movie.original_title);
    navigate(`/movie/${encodedTitle}`, { state: { user: user, movie: movie } });
  };

  return (
    <>
      <Navbar user={user} />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Movies Associated with <span className="text-blue-800">{directorName}</span></h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {movies.map((movie) => (
            <div key={movie.id} className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer" onClick={() => onMovieClick(movie)}>
              <img
                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
                <p className="text-gray-700 mb-2">{movie.overview}</p>
                <div className="flex justify-between">
                  <span className="text-gray-500">{movie.release_date ? `Released: ${new Date(movie.release_date).getFullYear()}` : 'Release date not available'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Directors;
