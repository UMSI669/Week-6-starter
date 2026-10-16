import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

export default function PokeballIcon({ active = false, size = 22 }) {
  const outline = active ? colors.red : '#A9B2C1';
  const borderWidth = Math.max(1, size * 0.055);

  return (
    <View style={[styles.ball, { width: size, height: size, borderRadius: size / 2, borderWidth, borderColor: outline }]}>
      <View style={[styles.top, { backgroundColor: active ? colors.red : '#E5E8ED' }]} />
      <View style={styles.bottom} />
      <View style={[styles.band, { borderTopColor: outline, borderBottomColor: outline, height: size * 0.18, top: size * 0.41 }]}>
        <View style={[styles.button, { borderColor: outline, width: size * 0.34, height: size * 0.34, borderRadius: size * 0.17 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ball: { overflow: 'hidden', backgroundColor: '#fff' },
  top: { position: 'absolute', left: 0, right: 0, top: 0, height: '50%' },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '50%', backgroundColor: '#fff' },
  band: { position: 'absolute', left: 0, right: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderTopWidth: 1, borderBottomWidth: 1 },
  button: { backgroundColor: '#fff', borderWidth: 1.5 },
});
