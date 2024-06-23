import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";

const Directors = () => {
    const location = useLocation();
    const { directorID, directorName, user } = location.state;
    const [movies, setMovies] = useState([]);
    const navigate = useNavigate();
    const fetchDirectorMovies = async (directorID) => {
        const moviesUrl = `https://api.themoviedb.org/3/discover/movie?with_crew=${directorID}&include_adult=false&language=en-US&page=1`;
        try {
            const response = await fetch(moviesUrl, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NmRjOGQ1OWVkNTVhNTMxZTYwMjk5YzMwYjUxMjdlNiIsInN1YiI6IjY1ZTRiMTYwOTk3OWQyMDE3Y2IyOWRhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qBFYp1I62IBsHk461pbpTC7eapxnXM02dvD0aAcIUAU'
                }
            });
            const result = await response.json();
            console.log(result);
            setMovies(result.results);
        } catch (error) {
            console.error('Error fetching director movies:', error);
        }
    };

    useEffect(() => {
        fetchDirectorMovies(directorID);
    }, [directorID]);

    const onMovieclick = (movv) => {
        navigate(`/movie/${movv.original_title}`, {state:{ user : user, movie : movv}})
    }

    return (
        <>
        <Navbar user={user}/>
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Movies Associated with <span className="text-blue-800">{directorName} </span></h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {movies.map((movie) => (
                    <div key={movie.id} className="bg-white shadow-lg rounded-lg overflow-hidden" onClick={()=>{onMovieclick(movie)}}>
                        <img
                            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                            alt={movie.title}
                            className="w-full h-64 object-cover"
                        />
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

export default Directors;
