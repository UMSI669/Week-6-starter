import * as Linking from 'expo-linking';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme/tokens';

export default function OpenWeatherAttribution() {
  const [failed, setFailed] = useState(false);
  return <View>
    <Pressable accessibilityRole="link" onPress={() => {
      setFailed(false);
      Linking.openURL('https://openweathermap.org').catch(() => setFailed(true));
    }} style={styles.link}>
      <Text style={styles.text}>Weather data © OpenWeather</Text>
    </Pressable>
    {failed && <Text style={styles.error}>Could not open the link. Visit https://openweathermap.org.</Text>}
  </View>;
}
const styles = StyleSheet.create({
  link: { paddingVertical: spacing.md, minHeight: 44, justifyContent: 'center', alignItems: 'center' },
  text: { ...typography.small, color: colors.heroText, textDecorationLine: 'underline' },
  error: { ...typography.small, color: colors.dangerText, textAlign: 'center' },
});
