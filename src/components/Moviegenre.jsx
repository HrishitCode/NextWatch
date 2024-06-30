import React, { useState, useEffect, useRef } from "react";
import StarRating from "./StarRating";
import { useNavigate } from "react-router-dom";
import AddtoWishlist from "./AddtoWishlist";

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
    return data.results;
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    throw error;
  }
};

const Moviegenre = ({ user, genreId }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [datatoSend, setDatatoSend] = useState(null);
  const [options, setOptions] = useState(false);
  const [showPopup, setShowPopup] = useState(null);
  const [wishMovie, setWishMovie] = useState(null);

  const navigate = useNavigate();
  const scrollContainerRef = useRef(null); // Ref for the scroll container

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

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    const handleWheel = (event) => {
      if (scrollContainer) {
        scrollContainer.scrollLeft += event.deltaY;
      }
    };

    if (scrollContainer) {
      scrollContainer.addEventListener('wheel', handleWheel);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('wheel', handleWheel);
      }
    };
  }, [scrollContainerRef]); // Correct dependency array

  const listhandle = (mov) => {
    setOptions(true);
    setDatatoSend(mov);
  };

  const handleRating = (mov) => {
    setDatatoSend(mov);
    setShowPopup(mov.id);
  };

  const onMovieclick = (movv) => {
    navigate(`/movie/${movv.original_title}`, { state: { user: user, movie: movv } });
  };

  const wishandle = (data) => {
    setWishMovie(data.id);
  };

  const RatingPopup = ({ movie }) => (
    <div className="absolute bottom-5 left-0 bg-white p-2 rounded shadow-lg">
      <h2 className="text-black text-center">RATING</h2>
      <StarRating user={user} movie={movie} />
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-t-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div ref={scrollContainerRef} className="flex overflow-x-auto overflow-y-hidden space-x-4" style={{ "-ms-overflow-style": "none", "scrollbar-width": "none", "::-webkit-scrollbar": "none" }}>
      {movies.length > 0 &&
        movies.map(movie => (
          <div key={movie.id} className="relative flex-shrink-0 w-48 transform hover:scale-110 transition-transform duration-300 ease-in-out group">
            <img className="w-full h-auto" src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} alt={movie.title} onClick={() => onMovieclick(movie)} />
            <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-3 pb-4 bg-opacity-75 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button onClick={() => handleRating(movie)} className="mx-0 text-white">Rate</button>
              <button onClick={() => wishandle(movie)} className="text-white">Wishlist</button>
              <button onClick={() => listhandle(movie)} className="text-white">AddToList</button>
              {options && navigate('/user/List', { state: { user: user, temMov: datatoSend } })}
              {wishMovie === movie.id && <AddtoWishlist user={user} data={movie} />}
            </div>
            {showPopup === movie.id && <RatingPopup movie={movie} />}
          </div>
        ))
      }
    </div>
  );
};

export default Moviegenre;
