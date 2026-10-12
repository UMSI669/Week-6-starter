import { StyleSheet, View } from 'react-native';
import { collectionColor } from '../theme/colors';

//This is where our Pokeball Icons are established
export function PokeballIcon({ color, size = 36 }: { color?: string; size?: number }) {
  const shade = color ?? collectionColor(String(size));
  return <View accessible={false} style={[styles.ball, { width: size, height: size, borderRadius: size / 2 }]}>
    <View style={[styles.top, { backgroundColor: shade, height: size / 2 - 2 }]} />
    <View style={styles.middle} />
    <View style={[styles.center, { width: size * 0.28, height: size * 0.28, borderRadius: size, borderWidth: Math.max(2, size * 0.07) }]} />
  </View>;
}

const styles = StyleSheet.create({
  ball: { overflow: 'hidden', borderWidth: 2, borderColor: '#172438', backgroundColor: '#FFFFFF', justifyContent: 'center' },
  top: { position: 'absolute', top: 0, left: 0, right: 0 },
  middle: { height: 3, backgroundColor: '#172438' },
  center: { position: 'absolute', alignSelf: 'center', backgroundColor: '#FFFFFF', borderColor: '#172438' },
});
