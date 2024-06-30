// src/utils/getMoviesRecommendations.js
export const getMoviesRecommendations = async (movieId) => {
    console.log("similar to : ", movieId);
    try {
      const url = `https://api.themoviedb.org/3/movie/${movieId}/recommendations`;
      const options = {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NmRjOGQ1OWVkNTVhNTMxZTYwMjk5YzMwYjUxMjdlNiIsInN1YiI6IjY1ZTRiMTYwOTk3OWQyMDE3Y2IyOWRhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qBFYp1I62IBsHk461pbpTC7eapxnXM02dvD0aAcIUAU",
        },
      };
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Failed to fetch movie recommendations");
      }
      const data = await response.json();
      console.log('Recommendations data:', data.results);
      return data.results.map(movie => ({
        id: movie.id,
        poster_path: movie.poster_path,
        title: movie.title,
        overview: movie.overview,
        release_date: movie.release_date,
      }));
    } catch (error) {
      console.error("Error fetching movie recommendations:", error);
      return [];
    }
  };
  