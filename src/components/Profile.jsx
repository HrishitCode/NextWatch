import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { getRatedMovies } from '../utils/getRatedMovies';
import { getMoviesbyIDtmdb } from '../utils/getMoviesbyIDtmdb';

const Profile = () => {
  const location = useLocation();
  const { user } = location.state;
  const navigate = useNavigate();
  const [path, setPath] = useState(null);
  const [movieIds, setMovieIds] = useState([]);
  const [movies, setMovies] = useState([]);

  const handleCardClick = (route) => {
    setPath(route);
  };

  useEffect(() => {
    const fetchRatedMovies = async () => {
      try {
        const ratedMovies = await getRatedMovies(user.email);
        setMovieIds(ratedMovies.slice(0, 3).map(movie => movie.movie_id));
      } catch (error) {
        console.log(error);
      }
    };

    if (user) {
      fetchRatedMovies();
    }
  }, [user]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieDetails = await Promise.all(
          movieIds.map(movieId => getMoviesbyIDtmdb(movieId))
        );
        setMovies(movieDetails.filter(movie => movie !== null));
      } catch (error) {
        console.log(error);
      }
    };

    if (movieIds.length > 0) {
      fetchMovieDetails();
    }
  }, [movieIds]);

  const onMovieClick = (movie) => {
    const encodedTitle = encodeURIComponent(movie.title);
    navigate(`/movie/${encodedTitle}`, { state: { user, movie } });
  };

  const onWatchMoreclick = () => {
    navigate('/user/Watched', { state: { user } });
  };


  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Profile Page</h1>
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          {user ? (
            <>
              <img src={user.picture} alt={user.name} className="rounded-full h-12 w-12 mb-4" />
              <p className="text-lg mb-2">Name: {user.name}</p>
              <p className="text-lg mb-2">Email: {user.email}</p>
            </>
          ) : (
            <p className="text-lg">No user data available. Please log in.</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Watchlist Card */}
          <div
            className="bg-white shadow-md rounded-lg p-6 cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            onClick={() => handleCardClick('/user/Wishlist')}
          >
            <p className="text-xl font-bold mb-2">Your Watchlist</p>
            <p className="text-sm text-gray-600">Click to view your watchlist</p>
          </div>

          {/* Created Lists Card */}
          <div
            className="bg-white shadow-md rounded-lg p-6 cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            onClick={() => handleCardClick('/user/List/')}
          >
            <p className="text-xl font-bold mb-2">Your Created Lists</p>
            <p className="text-sm text-gray-600">Click to view your created lists</p>
          </div>
        </div>
        {path && navigate(`${path}`, { state: { user } })}
        <div className="max-w-4xl mx-auto px-4 py-8 bg-white shadow-md rounded-lg p-6 mt-8 overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-4" onClick={()=>{onWatchMoreclick()}}>Watched Movies</h2>
          <div className="flex space-x-4 md:space-x-6 overflow-x-auto">
            {movies.map((movie, index) => (
              <div key={movie.id} className={`overflow-hidden bg-white shadow-lg rounded-lg relative ${index !== movies.length - 1 ? 'mr-4' : ''}`}>
                {movie.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-48 sm:w-56 h-72 sm:h-80 object-cover cursor-pointer"
                    onClick={() => onMovieClick(movie)}
                  />
                )}
                <div className="absolute inset-y-0 right-0 flex items-center justify-center pl-8" onClick={()=>{onWatchMoreclick()}}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-red-900 transform rotate-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.707 11.707a1 1 0 0 0 1.414 1.414l4-4a1 1 0 0 0 0-1.414l-4-4a1 1 0 1 0-1.414 1.414L9.586 8H4a1 1 0 1 0 0 2h5.586l-2.293 2.293z"
                      />
                    </svg>
                  </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
