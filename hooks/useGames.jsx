import { useQuery } from "@tanstack/react-query";
import { searchGames } from "../src/api/rawg";

export function useGames(search, enabled = true) {
  return useQuery({
    queryKey: ["rawg", "games", search.trim()],
    queryFn: ({ signal }) => searchGames(search.trim(), signal),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled,
  });
}
