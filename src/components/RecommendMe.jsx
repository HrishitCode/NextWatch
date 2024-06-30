import { getMoviesRecommendations } from "../utils/getMovieRecommendations";
const RecommendMe = () => {
    useEffect(() => {
        const fetchMoviesRecom = async () => {
          try {
            const data = await getMoviesRecommendations(user.email);
            setMovies(data);
          } catch (error) {
            setError(error.message);
          } finally {
            setLoading(false);
          }
        };
    
        if (movies.length > 0) {
          fetchMoviesRecom();
        }
      }, [movies]);
    console.log(movies);
    return(<><h1>JIJIJIJIJI</h1></>)
}

export default RecommendMe;