import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = { message: string; retry?: () => void };

export function StateMessage({ message, retry }: Props) {
  return (
    <View style={styles.box}>
      <Text style={styles.message}>{message}</Text>
      {retry && <Pressable accessibilityRole="button" onPress={retry} style={styles.button}><Text style={styles.buttonText}>Try again</Text></Pressable>}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 16, alignItems: 'center', gap: 14 },
  message: { color: '#526078', fontSize: 16, lineHeight: 24, textAlign: 'center' },
  button: { backgroundColor: '#3155A6', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  buttonText: { color: '#FFFFFF', fontWeight: '700' },
});
