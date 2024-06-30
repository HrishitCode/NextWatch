// src/utils/getMoviesbyIDtmdb.js
export const getMoviesbyIDtmdb = async (movieId) => {
    try {
      const url = `https://api.themoviedb.org/3/movie/${movieId}`;
      const options = {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NmRjOGQ1OWVkNTVhNTMxZTYwMjk5YzMwYjUxMjdlNiIsInN1YiI6IjY1ZTRiMTYwOTk3OWQyMDE3Y2IyOWRhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qBFYp1I62IBsHk461pbpTC7eapxnXM02dvD0aAcIUAU",
        },
      };
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Failed to fetch movie details");
      }
      const data = await response.json();
      console.log('datatata', data);
      return {
        id: movieId,
        poster_path: data.poster_path,
        title: data.title,
        overview: data.overview,
        cast: data.cast,
        crew: data.crew,
        release_date: data.release_date,
      };
    } catch (error) {
      console.error("Error fetching movie data:", error);
      return null;
    }
  };
  