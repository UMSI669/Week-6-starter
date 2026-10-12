import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getPokemonDetail, getPokemonPage, getTypePokemon, getTypes, searchPokemon } from '../api/pokeApi';

const DAY = 24 * 60 * 60 * 1000;
export const queryKeys = {
  list: ['pokemon', 'list'] as const,
  detail: (id: number) => ['pokemon', 'detail', id] as const,
  types: ['pokemon', 'types'] as const,
  type: (name: string) => ['pokemon', 'type', name] as const,
  search: (term: string) => ['pokemon', 'search', term] as const,
};

//QJ Comment:We are using TanStack query keys to keep each page, type, search, and detail cache distinct.
//This ensures that "the query key is serializable using JSON.stringify, and unique to the query's data, you can use it!"
//Info from https://tanstack.com/query/latest/docs/framework/react/guides/query-keys
// TODO(SI 669): Explain why staleTime avoids repeat requests for rarely changing Pokémon data.
export function usePokemonList() {
  // TODO(SI 669): Explain how getNextPageParam advances infinite pagination without loading the whole Pokédex.
  return useInfiniteQuery({
    queryKey: queryKeys.list, initialPageParam: 0,
    queryFn: ({ pageParam, signal }) => getPokemonPage(pageParam, signal),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    //QJ Comment: this means our data is considered 'fresh' for a day
    //It will stay in the 'garbage cache' for a week
    //This means that we are not constantly calling back to the API
    staleTime: DAY, gcTime: 7 * DAY,
  });
}
//QJ Comment: This is what allows the user to scroll through the pokemon infinitely
//There are loading points 
export function usePokemonSearch(term: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.search(term), initialPageParam: 0,
    queryFn: ({ pageParam, signal }) => searchPokemon(term, pageParam, signal),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: term.trim().length > 0, staleTime: DAY, gcTime: DAY,
  });
}
//QJ: This is calling all of the types available from the PokéAPI
export function usePokemonTypes() {
  return useQuery({ queryKey: queryKeys.types, queryFn: ({ signal }) => getTypes(signal), staleTime: 7 * DAY, gcTime: 14 * DAY });
}
//This is grabbing all of the pokemon of a certain type
export function useTypePokemon(type: string) {
  return useQuery({ queryKey: queryKeys.type(type), queryFn: ({ signal }) => getTypePokemon(type, signal), enabled: !!type, staleTime: DAY, gcTime: 7 * DAY });
}

//QJ Comment: We are using TanStack useQuery Explain why TanStack Query owns fetching, errors, deduplication, and cached detail objects.
export function usePokemonDetails(id: number) {
  return useQuery({ queryKey: queryKeys.detail(id), queryFn: ({ signal }) => getPokemonDetail(id, signal), enabled: id > 0, staleTime: DAY, gcTime: 7 * DAY, retry: 1 });
}
