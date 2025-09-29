import Movie from "../model/Movie.js";
import { moviesData } from "../data/movies.js";

const normalizeSeed = (m) => ({
  ...m,
  releaseDate: new Date(m.releaseDate),
});

export default async function seedMovies() {
  const count = await Movie.countDocuments();
  if (count > 0) return;
  const docs = moviesData.map(normalizeSeed);
  await Movie.insertMany(docs);
  // Ensure movieId uniqueness preserved; if duplicates, Mongo will error which is fine during dev
}




