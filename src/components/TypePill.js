import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, typeColors } from '../theme/colors';

export default function TypePill({ type }) {
  const [backgroundColor, color] = typeColors[type] || [colors.line, colors.ink];
  return (
    <View style={[styles.pill, { backgroundColor }]}>
      <Text style={[styles.text, { color }]}>{type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { borderRadius: 8, paddingHorizontal: 9, paddingVertical: 5, marginRight: 6 },
  text: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
});
