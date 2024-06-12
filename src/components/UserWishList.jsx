import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState, createContext } from "react";
import { useNavigate } from 'react-router-dom';

const WishlistContext = createContext();

async function fetchData(movieId) {
  try {
    console.log('IDDID : ', movieId);
    const url = `https://api.themoviedb.org/3/movie/${movieId}`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NmRjOGQ1OWVkNTVhNTMxZTYwMjk5YzMwYjUxMjdlNiIsInN1YiI6IjY1ZTRiMTYwOTk3OWQyMDE3Y2IyOWRhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qBFYp1I62IBsHk461pbpTC7eapxnXM02dvD0aAcIUAU'
      }
    };

    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
    return { id: movieId, poster_path: data.poster_path };
  } catch (err) {
    console.error('error:', err);
  }
}

const UserWishlist = () => { 
  const { user } = useAuth0();
  const [wishlist, setWishlist] = useState(null);
  const navigate = useNavigate();

  const getData = async () => {
    console.log(user);
    try {    
      const response = await fetch(`http://localhost:3001/showWishlist`, {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify({ email: user.email })
      });
      if (!response.ok) {
        throw new Error('Network Response was not ok');
      }
      const data = await response.json(); // Extract response data
      //console.log('Wishlist:', data);
      const datatosend = data[0].movie_id;
      console.log(datatosend);
      const posterPaths = await Promise.all(datatosend.map(async (movieId) => {
        return await fetchData(movieId);
      }));
    
      setWishlist(posterPaths.filter(poster => poster));
      console.log(wishlist);
    } catch(error) {
      console.log("ERROR : ", error);
    }
  }

  const wishandle = async (user, movieId, navigate) => {
    console.log(movieId);
    try {
      const response = await fetch('http://localhost:3001/removeWishlist', {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify({email : user.email, mvid : movieId})
      });
      if (!response.ok){
        throw new Error('Network Response was not ok');
      }
      console.log(`REMOVED ${movieId}`);
      await getData(); // Refetch wishlist data after removal
    } catch(error) {
      console.log('Error sending data', error);
    }
  }

  useEffect(() => {
    if (user) {
      getData();
    }
  }, [user]);

  console.log(wishlist);

  return (
    <div>
      <h1>User Wishlists</h1>
      {wishlist && wishlist.map((movie, index) => (
        <img key={index} src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} onClick={() => wishandle(user, movie.id, navigate)} />
      ))}
    </div>
  );
}

export default UserWishlist;
