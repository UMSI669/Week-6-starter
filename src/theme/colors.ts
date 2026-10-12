export const colors = {
  red: '#D93732', redDark: '#AE2624', yellow: '#F7C948', blue: '#245A9A',
  ink: '#172438', muted: '#526174', background: '#F5F7FA', white: '#FFFFFF',
  border: '#D9E1E9', success: '#176448',
};

// TODO(SI 669): Explain where students could customize the visual theme and type palette.
export const typeColors: Record<string, string> = {
  normal: '#696E75', fire: '#B83E2B', water: '#2465A8', electric: '#8A6400',
  grass: '#277245', ice: '#28768A', fighting: '#A43A2F', poison: '#754899',
  ground: '#83612D', flying: '#5964A6', psychic: '#B23770', bug: '#537126',
  rock: '#716443', ghost: '#5B4780', dragon: '#5544A3', dark: '#464B56',
  steel: '#526573', fairy: '#A53E79',
};

export const collectionColors = ['#D93732', '#245A9A', '#277245', '#754899', '#B87825', '#426A78'];

export function collectionColor(id: string): string {
  let hash = 0;
  for (const character of id) hash = (hash * 31 + character.charCodeAt(0)) | 0;
  return collectionColors[Math.abs(hash) % collectionColors.length];
}
