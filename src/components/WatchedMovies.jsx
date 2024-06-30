import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getRatedMovies } from "../utils/getRatedMovies";
import { getMoviesbyIDtmdb } from "../utils/getMoviesbyIDtmdb";
import StarRating from "./StarRating";
import Navbar from "./Navbar";

const WatchedMovies = () => {
  const location = useLocation();
  const { user } = location.state;
  const [movies, setMovies] = useState([]);
  const [movieIds, setMovieIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieIds = async () => {
      try {
        const ratedMovies = await getRatedMovies(user.email);
        setMovieIds(ratedMovies.map(movie => movie.movie_id));
      } catch (error) {
        console.log(error);
      }
    };
    if (user) {
      fetchMovieIds();
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

  if (movies.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <Navbar user={user}/>
    <h1 className="text-2xl font-bold mb-4">{user.nickname}'s Watched Movies</h1>
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            onClick={() => onMovieClick(movie)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-72 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
              <p className="text-gray-700 mb-2 truncate">{movie.overview}</p>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">
                  {movie.release_date ? `Released: ${new Date(movie.release_date).getFullYear()}` : 'Release date not available'}
                </span>
              </div>
              <div className="mt-2">
                <StarRating user={user} movie={movie} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default WatchedMovies;
