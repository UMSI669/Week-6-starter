import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = PropsWithChildren<{ eyebrow: string; title: string; description: string; symbol: string }>;

export function PlaceholderScreen({ eyebrow, title, description, symbol, children }: Props) {
  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text accessibilityRole="header" style={styles.title}>{title}</Text>
        <View style={styles.card}>
          <Text accessible={false} style={styles.symbol}>{symbol}</Text>
          <Text style={styles.description}>{description}</Text>
          {children}
        </View>
        <Text style={styles.note}>Browse · Save · Enjoy</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F6FA' },
  content: { padding: 24, width: '100%', maxWidth: 720, alignSelf: 'center', gap: 20 },
  eyebrow: { color: '#3155A6', fontSize: 12, fontWeight: '700', letterSpacing: 2, marginTop: 24 },
  title: { color: '#18233D', fontSize: 32, fontWeight: '700' },
  card: { backgroundColor: '#FFFFFF', padding: 28, borderRadius: 20, alignItems: 'center', gap: 18, marginTop: 20 },
  symbol: { color: '#3155A6', fontSize: 48 },
  description: { color: '#526078', fontSize: 17, lineHeight: 26, textAlign: 'center' },
  note: { color: '#526078', textAlign: 'center', fontSize: 13, marginTop: 12 },
});
