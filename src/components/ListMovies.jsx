import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const ListMovies = () => {
  const location = useLocation();
  const { user, listid } = location.state;
  const [title, setTitle] = useState();
  const navigate = useNavigate()
  console.log("user", user);

  const [movies, setMovies] = useState([]);

  const fetchData = async (movieId) => {
    try {
      const url = `https://api.themoviedb.org/3/movie/${movieId}`;
      const options = {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NmRjOGQ1OWVkNTVhNTMxZTYwMjk5YzMwYjUxMjdlNiIsInN1YiI6IjY1ZTRiMTYwOTk3OWQyMDE3Y2IyOWRhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qBFYp1I62IBsHk461pbpTC7eapxnXM02dvD0aAcIUAU",
        },
      };
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Failed to fetch movie details");
      }
      const data = await response.json();
      console.log('datatata', data);
      return {
        id: movieId,
        poster_path: data.poster_path,
        title: data.title,
        overview: data.overview,
      };
    } catch (error) {
      console.error("Error fetching movie data:", error);
      return null;
    }
  };

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
          return await fetchData(movieId);
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
    navigate(`/movie/${movie.title}`, {state:{ user : user, movie : movie}})
  }

  return (
    <>
    <Navbar user={user}/>
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
                onClick={()=>onmovieClick(movie)}
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
