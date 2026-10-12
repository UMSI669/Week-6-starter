export type NamedResource = { name: string; url: string };

export type PokemonRef = { id: number; name: string };

export type PokemonPage = {
  count: number;
  results: NamedResource[];
};

export type PokemonDetail = {
  id: number;
  name: string;
  sprites?: {
    front_default?: string | null;
    other?: {
      'official-artwork'?: { front_default?: string | null };
    };
  };
  types?: { slot: number; type: NamedResource }[];
  abilities?: { ability: NamedResource; is_hidden: boolean }[];
  stats?: { base_stat: number; stat: NamedResource }[];
};

export type TypeList = { results: NamedResource[] };
export type TypeDetail = { pokemon: { pokemon: NamedResource }[] };

export type SearchResponse = {
  data?: { pokemon_v2_pokemon?: { id: number; name: string }[] };
  errors?: { message: string }[];
};
