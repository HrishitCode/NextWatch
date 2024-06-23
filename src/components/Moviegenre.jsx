import React, { useState, useEffect } from "react";
import Movie from "./Movie";
import StarRating from "./StarRating";
import { useNavigate } from "react-router-dom";
import AddtoWishlist from "./AddtoWishlist";
//import './Moviegenre.css'

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


const Moviegenre = ({ user, genreId }) => {
  console.log('here : ', user);
  console.log('here : ', genreId);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [datatoSend, setDatatoSend] = useState(null); 
  const [options, setOptions] = useState(false);
  const [showPopup, setShowPopup] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [wishMovie, setWishMovie] = useState(null);
  
  const wishandle = (data) => {
    setWishMovie(data.id);
  }
  const navigate = useNavigate();
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

  const listhandle = (mov) => {
    setOptions(true);
    setDatatoSend(mov);
  }

  const handleRating = (mov) => {
    setDatatoSend(mov);
    setShowPopup(mov.id);
  }

  const onMovieclick = (movv) =>{
    console.log(movv);
    navigate(`/movie/${movv.original_title}`, {state:{ user : user, movie : movv}})
  }


  const RatingPopup = ({ movie }) => (
    <>
        <div className="absolute bottom-5 left-0 bg-white p-2 rounded shadow-lg">
          <h2 className="text-black text-center">RATING</h2>
          <StarRating user={user} movie={movie} />
      </div>
    </>
  );

  return (
    <div className="flex overflow-x-auto overflow-y-hidden space-x-4" style={{ "-ms-overflow-style": "none", "scrollbar-width": "none", "::-webkit-scrollbar": "none" }}>
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