import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const apiKey = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NmRjOGQ1OWVkNTVhNTMxZTYwMjk5YzMwYjUxMjdlNiIsInN1YiI6IjY1ZTRiMTYwOTk3OWQyMDE3Y2IyOWRhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qBFYp1I62IBsHk461pbpTC7eapxnXM02dvD0aAcIUAU';

const Search = ({user}) => {
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [searchMovie, setSearchMovie] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 500); // Debounce time: 500ms

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  useEffect(() => {
    if (debouncedValue.trim() === '') {
      setSearchMovie([]);
      return;
    }

    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(debouncedValue)}&language=en-US&page=1`;

    async function fetchMovies() {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: apiKey,
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        //console.log(data.results);
        setSearchMovie(data.results); 
      } catch (err) {
        console.error('Error:', err);
      }
    }

    fetchMovies();
  }, [debouncedValue]);

  const handleOnTextChange = (event) => {
    setInputValue(event.target.value);
  };

  const onSearchMovieClick = (mov) => {
    setSearchMovie(null);
    navigate(`/movie/${mov.original_title}`, {state:{ user : user, movie : mov}});
  }

  return (
    <div className='relative'>
      <input 
        value={inputValue} 
        type="text" 
        placeholder='Search' 
        onChange={handleOnTextChange} 
      />
      <div className="absolute z-50 overflow-x-hidden overflow-y-hidden">
        {searchMovie && searchMovie.slice(0, 5).map((mov) => (
          <div key={mov.id} className='bg-white flex items-center border border-solid border-black w-full p-2 flex-shrink-0 transform hover:scale-110 transition-transform duration-300 ease-in-out group cursor-pointer' onClick={()=>onSearchMovieClick(mov)}>
          {mov.poster_path && (
            <img 
              className="h-20 w-16 border border-solid border-gray-300 mr-2"
              src={`https://image.tmdb.org/t/p/original/${mov.poster_path}`} 
              alt={mov.title} 
            />
          )}
          <p className="text-black bg-white bg-opacity-75 p-1 rounded flex-1">{mov.title}</p>
        </div>
        
        ))}
      </div>
    </div>
  );
};

export default Search;
