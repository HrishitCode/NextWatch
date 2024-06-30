import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { getMoviesbyIDtmdb } from '../utils/getMoviesbyIDtmdb';

const ListMovies = () => {
  const location = useLocation();
  const { user, listid } = location.state;
  const [title, setTitle] = useState();
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  const getData = async () => {
    try {
      const response = await fetch(`http://localhost:3001/show/listMovies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listid: listid }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch wishlist data");
      }

      const data = await response.json();
      const movieIds = data.movies;
      setTitle(data.title);
      const posterPaths = await Promise.all(
        movieIds.map(async (movieId) => {
          return await getMoviesbyIDtmdb(movieId);
        })
      );
      setMovies(posterPaths.filter((movie) => movie !== null));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, [listid]);

  const onmovieClick = (movie) => {
    const encodedTitle = encodeURIComponent(movie.original_title);
    navigate(`/movie/${encodedTitle}`, { state: { user: user, movie: movie } });
  };

  return (
    <>
      <Navbar user={user} />
      <div className="max-w-4xl mx-auto bg-white rounded-lg overflow-hidden shadow-lg p-6">
        <h1 className="text-3xl font-semibold mb-4">{user.nickname}'s <span className="text-blue-800">{title}</span> Movies</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {movies.map((movie) => (
            <div key={movie.id} className="overflow-hidden bg-white shadow-lg rounded-lg relative">
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-64 object-cover cursor-pointer"
                  onClick={() => onmovieClick(movie)}
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
                <p className="text-gray-700">{movie.overview}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ListMovies;
