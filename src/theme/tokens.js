export const colors = {
  background: '#082b5b', panel: '#194378', hero: '#1c5fa3', surface: '#f7f9fd',
  input: '#f5f8fe', white: '#ffffff', text: '#173b69', muted: '#b7c9e5',
  secondary: '#9bc8ff', heroText: '#d9ecff', placeholder: '#7692b8',
  metricLabel: '#6680a1', accent: '#ffca73', danger: '#e55d7a',
  dangerText: '#ff91a8', divider: '#5592cd', overlay: 'rgba(8, 25, 49, 0.78)',
  cardTitle: '#102f57', inactiveFavorite: '#8fa6c4',
};
export const spacing = { xxs: 2, xs: 4, sm: 8, md: 12, lg: 18, xl: 20, xxl: 24, section: 30, bottom: 42 };
export const radii = { sm: 11, input: 15, button: 18, card: 22, hero: 28 };
/** @satisfies {Record<string, import('react-native').TextStyle>} */
export const typography = {
  // Platform system fonts, matching the original mockup without font downloads.
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  title: { fontSize: 31, fontWeight: '800', letterSpacing: -0.8 },
  heading: { fontSize: 19, fontWeight: '800' },
  body: { fontSize: 14 }, small: { fontSize: 12 },
  input: { fontSize: 16 }, savedLabel: { fontSize: 8, fontWeight: '800', letterSpacing: 1.4 },
  button: { fontSize: 14, fontWeight: '800' },
  temperature: { fontSize: 68, fontWeight: '200', letterSpacing: -4, lineHeight: 76 },
};
