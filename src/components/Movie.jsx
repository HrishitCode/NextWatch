import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import StarRating from './StarRating';
import Navbar from './Navbar';
import AddtoWishlist from './AddtoWishlist';
import { MdPlaylistAdd, MdList } from 'react-icons/md';
import Swal from 'sweetalert2';
import { getMoviesRecommendations } from '../utils/getMovieRecommendations';

const Movie = () => {
    const location = useLocation();
    const { user, movie } = location.state;
    console.log({ user, movie });
    const [image, setImage] = useState(null);
    const [image1, setImage1] = useState(null);
    const [wishlist, setWishlist] = useState(false);
    const [addToList, setAddToList] = useState(false);
    const [director, setDirector] = useState(null);
    const [cast, setCast] = useState([]);
    const navigate = useNavigate();
    const [moviesRecom, setMoviesRecom] = useState([]);
    const [error, setError] = useState(null);

    const scrollContainerRef = useRef(null);

    useEffect(() => {
        setImage(null);
        setImage1(null);
        setWishlist(false);
        setAddToList(false);
        setDirector(null);
        setCast([]);
        setMoviesRecom([]);
        setError(null);

        // Scroll to top
        window.scrollTo(0, 0);

        // Reset scroll container position
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = 0;
        }
    }, [movie.id]);

    useEffect(() => {
        const fetchImage = async () => {
            const movieUrl = `https://api.themoviedb.org/3/movie/${movie.id}/images`;
            const movieOptions = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NmRjOGQ1OWVkNTVhNTMxZTYwMjk5YzMwYjUxMjdlNiIsInN1YiI6IjY1ZTRiMTYwOTk3OWQyMDE3Y2IyOWRhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qBFYp1I62IBsHk461pbpTC7eapxnXM02dvD0aAcIUAU'
                }
            };

            const response = await fetch(movieUrl, movieOptions);
            const result = await response.json();
            if (result.backdrops && result.backdrops.length > 0) {
                setImage(result.backdrops[0].file_path);
                if (result.backdrops.length > 1) {
                    setImage(result.backdrops[1].file_path);
                }
            }
        };
        setImage(null);
        fetchImage();
    }, [movie.id]);

    useEffect(() => {
        const fetchCredit = async () => {
            const movieUrl = `https://api.themoviedb.org/3/movie/${movie.id}/credits`;
            const movieOptions = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NmRjOGQ1OWVkNTVhNTMxZTYwMjk5YzMwYjUxMjdlNiIsInN1YiI6IjY1ZTRiMTYwOTk3OWQyMDE3Y2IyOWRhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qBFYp1I62IBsHk461pbpTC7eapxnXM02dvD0aAcIUAU'
                }
            };
            const response = await fetch(movieUrl, movieOptions);
            const result = await response.json();
            console.log('CREDITS : ', result);
            const directorData = result.crew.find((member) => member.job === 'Director');
            setDirector(directorData);

            // Sort cast by popularity and get the top 4
            const sortedCast = result.cast.sort((a, b) => b.popularity - a.popularity).slice(0, 4);
            setCast(sortedCast);
        };
        fetchCredit();
        console.log(movie);
        let dete = movie.title + ' ' + movie.release_date.slice(0, 4);
        console.log(dete);
        const url = `https://online-movie-database.p.rapidapi.com/v2/search?searchTerm=${dete}&type=MOVIE`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '25ea08c5cdmsh28e2ae73ea6ab7ap1b0a41jsn4aae4c97e71f',
                'x-rapidapi-host': 'online-movie-database.p.rapidapi.com'
            }
        };
        const getDetails = async () => {
            try {
                const response = await fetch(url, options);
                const result = await response.json();
                console.log(result);
                setImage1(result.data.mainSearch.edges[0].node.entity.primaryImage.url);
            } catch (error) {
                console.error(error);
            }
        }
        getDetails();
    }, [movie.id]);

    const handleAddToWishlist = () => {
        setWishlist(true);
    };

    const handleAddToList = () => {
        setAddToList(true);
    };

    const ondirectorClick = (directorID) => {
        navigate(`/user/director/${directorID}`, { state: { directorID: directorID, directorName: director.name, user: user } });
    }

    const onCastClick = (castID) => {
        navigate(`/user/director/${castID}`, { state: { directorID: castID, directorName: "", user: user } });
    }

    useEffect(() => {
        const fetchMoviesRecom = async () => {
            try {
                const data = await getMoviesRecommendations(movie.id);
                setMoviesRecom(data);
                console.log(data);
            } catch (error) {
                setError(error.message);
            }
        };
        fetchMoviesRecom();
    }, [movie.id]);

    const onMovieClick = (movie) => {
        const encodedTitle = encodeURIComponent(movie.title);
        navigate(`/movie/${encodedTitle}`, { state: { user, movie } });
    };

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        const onWheel = (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                scrollContainer.scrollLeft += e.deltaY;
            }
        };

        if (scrollContainer) {
            scrollContainer.addEventListener('wheel', onWheel);
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('wheel', onWheel);
            }
        };
    }, []);

    return (
        <>
            <Navbar user={user} />
            <div className="max-w-4xl mx-auto bg-white rounded-lg overflow-hidden shadow-lg p-6">
                <div className="w-full mb-4">
                    {image && <img className="w-full h-auto" src={`https://image.tmdb.org/t/p/original/${image}`} alt={`${movie.title} additional image`} />}
                    {!image && image1 && <img className="w-full h-auto" src={`${image1}`} alt={`${movie.title} additional image`} />}
                </div>
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between space-x-4 mb-4">
                            <h1 className="text-2xl font-bold text-gray-800">{movie.title}</h1>
                            <StarRating user={user} movie={movie} />
                        </div>
                        <p className="text-base mb-4">{movie.overview}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <img className="w-48 h-auto mb-4" src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} alt={movie.title} />
                        <div className='flex flex-row space-x-2'>
                            <div className="relative group mb-4">
                                <button onClick={handleAddToWishlist} className="text-gray-800 hover:text-blue-500 focus:outline-none">
                                    <MdPlaylistAdd size={32} />
                                </button>
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 translate-y-2 px-2 py-1 text-sm bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Add to Wishlist
                                </span>
                            </div>
                            <div className="relative group">
                                <button onClick={handleAddToList} className="text-gray-800 hover:text-blue-500 focus:outline-none">
                                    <MdList size={32} />
                                </button>
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 translate-y-2 px-2 py-1 text-sm bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Add to List
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                {director && (
                    <>
                        <h1 className='text-2xl text-gray-800'>Director</h1>
                        <div className="flex items-center mt-4" onClick={() => ondirectorClick(director.id)}>
                            <img className="w-16 h-auto rounded-full mr-4" src={`https://image.tmdb.org/t/p/original/${director.profile_path}`} alt={director.name} />
                            <p className="text-lg font-semibold">{director.name}</p>
                        </div>
                    </>
                )}
                {cast.length > 0 && (
                    <>
                        <h1 className='text-2xl text-gray-800 mt-4'>Cast</h1>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            {cast.map((member) => (
                                <div key={member.id} className="flex items-center" onClick={() => onCastClick(member.id)}>
                                    {member.profile_path && (
                                        <img className="w-16 h-auto rounded-full mr-4" src={`https://image.tmdb.org/t/p/original/${member.profile_path}`} alt={member.name} />
                                    )}
                                    <p className="text-lg font-semibold">{member.name}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                <h1 className='text-2xl text-gray-800 mt-4'>Few Recommendations</h1>
                <div ref={scrollContainerRef} className="flex overflow-x-auto space-x-4 mt-4" style={{ "-ms-overflow-style": "none", "scrollbar-width": "none", "::-webkit-scrollbar": "none" }}>
                    {moviesRecom.map((movie) => (
                        <div key={movie.id} className="flex-none">
                            {movie.poster_path && (
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
                                    className="w-48 sm:w-56 h-72 sm:h-80 object-cover cursor-pointer"
                                    onClick={() => onMovieClick(movie)}
                                />
                            )}
                        </div>
                    ))}
                </div>
                {wishlist && <AddtoWishlist user={user} data={movie} />}
                {addToList && navigate('/user/List', { state: { user: user, temMov: movie } })}
            </div>
        </>
    );
}

export default Movie;
