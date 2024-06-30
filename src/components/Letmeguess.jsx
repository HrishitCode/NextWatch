import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { getRatedMovies } from "../utils/getRatedMovies";

const Letmeguess = () => {
  const location = useLocation();
  const { user } = location.state;
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getRatedMovies(user.email);
        setMovies(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMovies();
    }
  }, [user]);



  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Navbar user={user} />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Let Me Guess</h1>
        <div>
          {movies.length > 0 ? (
            <ul>
              {movies.map((movie, index) => (
                <li key={index}>{movie.movie_id}</li>
              ))}
            </ul>
          ) : (
            <p>No movies found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Letmeguess;
