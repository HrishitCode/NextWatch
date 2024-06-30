import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const apiKey =
  'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NmRjOGQ1OWVkNTVhNTMxZTYwMjk5YzMwYjUxMjdlNiIsInN1YiI6IjY1ZTRiMTYwOTk3OWQyMDE3Y2IyOWRhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qBFYp1I62IBsHk461pbpTC7eapxnXM02dvD0aAcIUAU';

const Search = ({ user }) => {
  console.log('user at Search : ', user);
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

    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
      debouncedValue
    )}&language=en-US&page=1`;

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
    setSearchMovie([]);
    const encodedTitle = encodeURIComponent(mov.original_title);
    navigate(`/movie/${encodedTitle}`, { state: { user: user, movie: mov } });
  };

  return (
    <div className="relative">
      <input
        value={inputValue}
        type="text"
        placeholder="Search"
        onChange={handleOnTextChange}
        className="bg-gray-700 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
      />
      <div className="absolute z-50 top-full left-0 bg-white shadow-lg rounded-lg mt-1 w-full overflow-y-auto max-h-60">
        {searchMovie.length > 0 && (
          searchMovie.slice(0, 5).map((mov) => (
            <div
              key={mov.id}
              className="flex items-center border-b border-gray-200 p-2 cursor-pointer hover:bg-gray-100 transition duration-300"
              onClick={() => onSearchMovieClick(mov)}
            >
              {mov.poster_path && (
                <img
                  className="h-20 w-16 object-cover rounded border border-gray-300 mr-2"
                  src={`https://image.tmdb.org/t/p/original/${mov.poster_path}`}
                  alt={mov.title}
                />
              )}
              <p className="text-black truncate">{mov.title}</p>
            </div>
          )))}
      </div>
    </div>
  );
};

export default Search;
