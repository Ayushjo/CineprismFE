/*
 * Genre taxonomy — maps pretty slugs to the genre strings the backend
 * stores on posts (used by /genres/[slug] → /posts/search/:genre).
 */
export type GenreAccent = "red" | "gold" | "neutral";

export interface GenreDef {
  slug: string;
  name: string;
  /** Value matched against Post.genres on the backend. */
  query: string;
  accent: GenreAccent;
  tagline: string;
}

export const GENRES: GenreDef[] = [
  { slug: "sci-fi", name: "Sci-Fi", query: "Sci-Fi", accent: "gold", tagline: "Futures, foretold and feared." },
  { slug: "action", name: "Action", query: "Action", accent: "red", tagline: "Kinetics as language." },
  { slug: "thriller", name: "Thriller", query: "Thriller", accent: "neutral", tagline: "The slow tightening of the screw." },
  { slug: "drama", name: "Drama", query: "Drama", accent: "neutral", tagline: "The ordinary, rendered unbearable." },
  { slug: "horror", name: "Horror", query: "Horror", accent: "red", tagline: "What the dark keeps." },
  { slug: "animation", name: "Animation", query: "Animation", accent: "gold", tagline: "Drawn worlds, deeper truths." },
  { slug: "comedy", name: "Comedy", query: "Comedy", accent: "neutral", tagline: "Tragedy, timed." },
  { slug: "war", name: "War", query: "War", accent: "neutral", tagline: "The theatre of the worst of us." },
  { slug: "crime", name: "Crime", query: "Crime", accent: "red", tagline: "The city, and everything it hides." },
];

export function genreBySlug(slug: string): GenreDef | undefined {
  return GENRES.find((g) => g.slug === slug);
}
