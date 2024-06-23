import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";

const UserWishlist = () => {
  const location = useLocation();
  const { user } = location.state;
  const [wishlist, setWishlist] = useState(null);
  const navigate = useNavigate();
  console.log(user);
  const fetchData = async (movieId) => {
    try {
      const url = `https://api.themoviedb.org/3/movie/${movieId}`;
      const options = {
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NmRjOGQ1OWVkNTVhNTMxZTYwMjk5YzMwYjUxMjdlNiIsInN1YiI6IjY1ZTRiMTYwOTk3OWQyMDE3Y2IyOWRhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qBFYp1I62IBsHk461pbpTC7eapxnXM02dvD0aAcIUAU'
        }
      };
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Failed to fetch movie details');
      }
      const data = await response.json();
      return { id: movieId, poster_path: data.poster_path, title: data.title, overview: data.overview };
    } catch (error) {
      console.error('Error fetching movie data:', error);
      return null;
    }
  };

  const getData = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`http://localhost:3001/showWishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch wishlist data');
      }
      
      const data = await response.json();
      const movieIds = data[0]?.movie_id || [];
      
      const posterPaths = await Promise.all(movieIds.map(async (movieId) => {
        return await fetchData(movieId);
      }));

      setWishlist(posterPaths.filter(poster => poster));
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlist([]);
    }
  };

  const removeFromWishlist = async (movieId) => {
    try {
      const response = await fetch('http://localhost:3001/removeWishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email, mvid: movieId })
      });

      if (!response.ok) {
        throw new Error('Failed to remove from wishlist');
      }

      await getData(); // Refetch wishlist data after removal
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  useEffect(() => {
    getData();
  }, [user]);

  return (
    <>
    <Navbar user={user}/>
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4">{user.nickname}'s Watchlist</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {wishlist && wishlist.map((movie) => (
          <div key={movie.id} className="relative">
            <img
              className="object-cover w-full h-64 cursor-pointer"
              src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
              alt={movie.title}
              onClick={() => navigate(`/movie/${movie.original_title}`, {state:{ user : user, movie : movie}})}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                onClick={() => removeFromWishlist(movie.id)}
              >
                Remove from Wishlist
              </button>
            </div>
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

export default UserWishlist;
