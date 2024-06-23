import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import StarRating from "./StarRating";
import Lists from "./Lists";
import Moviegenre from "./Moviegenre"


const url1 = 'https://api.themoviedb.org/3/genre/movie/list?language=en';
const options1 = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NmRjOGQ1OWVkNTVhNTMxZTYwMjk5YzMwYjUxMjdlNiIsInN1YiI6IjY1ZTRiMTYwOTk3OWQyMDE3Y2IyOWRhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qBFYp1I62IBsHk461pbpTC7eapxnXM02dvD0aAcIUAU'
  }
};


const fetchGenres = async () => {
  try {
    const response = await fetch(url1, options1);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log(data);
    const genres = data.genres;
    return data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
  }
};



const wishandle = (user, data, navigate) => {
  console.log(data.id);
  console.log(user);

  const sendData = async (user) => {
    try {
      const response = await fetch('http://localhost:3001/addWishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email, mvid: data.id })
      });
      if (!response.ok) {
        throw new Error('Network Response was not ok');
      }
      navigate('/');
    } catch (error) {
      console.log('Error sending data', error);
    }
  }

  if (user) {
    sendData(user);
  } else {
    return (<div>Waiting</div>);
  }
}

const GetMovies = ({ user }) => {
  console.log('Get Movies : ', user);
  const [error, setError] = useState(null);
  const [showRating, setShowRating] = useState(false);
  const [datatoSend, setDatatoSend] = useState(null);
  const [options, setOptions] = useState(false);
  const navigate = useNavigate();
  const [ genre, setGenre ] = useState([]);
  const handleRating = (mov) => {
    setDatatoSend(mov);
    setShowRating(true);
  }

  const listhandle = (mov) => {
    setOptions(true);
    setDatatoSend(mov);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const genres = await fetchGenres();
        setGenre(genres);
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, []);


  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      {genre.map((gid) => (
        <div key={gid.id}> 
            <p className="font-extrabold">{gid.name}</p>
            <span>
                <Moviegenre user={user} genreId={gid.id}/>
            </span>
        {/*
          <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} alt={`${movie.original_title}`} />
          <button onClick={() => handleRating(movie)}>Rate</button>
          <button onClick={() => wishandle(user, movie, navigate)}>Wishlist</button>
          <button onClick={() => listhandle(movie)}>ADDtoList</button>
          {showRating && datatoSend?.id === movie.id && <StarRating data={datatoSend} user={user} />}
          {options && navigate('/user/List', { state: { user: user, temMov: datatoSend } })}  */}
        </div>
      ))}
    </div>
  );
}

export default GetMovies;
