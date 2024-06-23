import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import StarRating from './StarRating';
import Navbar from './Navbar';
import AddtoWishlist from './AddtoWishlist';
import { MdPlaylistAdd, MdList } from 'react-icons/md';
import Swal from 'sweetalert2';

const Movie = () => {
    const location = useLocation();
    const { user, movie } = location.state;
    console.log({ user, movie });
    const [image, setImage] = useState(null);
    const [wishlist, setWishlist] = useState(false);
    const [addToList, setAddToList] = useState(false);
    const [director, setDirector] = useState(null);
    const navigate = useNavigate();
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
                setImage(result.backdrops[1].file_path);
            }
        };

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
        };
        fetchCredit();
    }, [movie.id]);

    const handleAddToWishlist = () => {
        setWishlist(true);
    };

    const handleAddToList = () => {
        setAddToList(true);
    };
    const ondirectorClick = (directorID) => {
        navigate(`/user/director/${directorID}`, {state : {directorID : directorID, directorName : director.name, user : user}});
    }
    return (
        <>
            <Navbar user={user}/>
            <div className="max-w-4xl mx-auto bg-white rounded-lg overflow-hidden shadow-lg p-6">
                {image && (
                    <div className="w-full mb-4">
                        <img className="w-full h-auto" src={`https://image.tmdb.org/t/p/original/${image}`} alt={`${movie.title} additional image`} />
                    </div>
                )}
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
                        <div className="flex items-center mt-4" onClick={()=>ondirectorClick(director.id)}>
                            <img className="w-16 h-auto rounded-full mr-4" src={`https://image.tmdb.org/t/p/original/${director.profile_path}` } alt={director.name} />
                            <p className="text-lg font-semibold">{director.name}</p>
                        </div>
                    </>
                )}
                {wishlist && <AddtoWishlist user={user} data={movie} />}
                {addToList && navigate('/user/List', { state: { user: user, temMov: datatoSend } })}
            </div>
        </>
    );
}

export default Movie;
