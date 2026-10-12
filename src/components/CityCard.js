import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function CityCard({ city, isFavorite, onOpen, onToggleFavorite }) {
  return (
    <Pressable onPress={() => onOpen(city.id)} style={styles.cityCard}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cityName}>{city.name}</Text>
          <Text style={styles.country}>{city.country}</Text>
        </View>
        <Pressable
          accessibilityLabel={`Toggle ${city.name} favorite`}
          hitSlop={10}
          onPress={() => onToggleFavorite(city.id)}
          style={styles.favoriteButton}
        >
          <Text style={[styles.favoriteIcon, isFavorite && styles.favoriteIconActive]}>
            {isFavorite ? '♥' : '♡'}
          </Text>
        </Pressable>
      </View>
      <View style={styles.weatherRow}>
        <Text style={styles.weatherIcon}>{city.icon}</Text>
        <View style={styles.temperatureBlock}>
          <Text style={styles.temperature}>{city.temperature}°</Text>
          <Text style={styles.condition}>{city.condition}</Text>
        </View>
        <View style={styles.rangeBlock}>
          <Text style={styles.range}>H {city.high}°</Text>
          <Text style={styles.range}>L {city.low}°</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cityCard: { backgroundColor: '#f7f9fd', borderRadius: 22, marginBottom: 12, padding: 18 },
  cardHeader: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  cityName: { color: '#102f57', fontSize: 19, fontWeight: '800' },
  country: { color: '#6680a1', fontSize: 12, marginTop: 2 },
  favoriteButton: { marginTop: -4, padding: 4 },
  favoriteIcon: { color: '#8fa6c4', fontSize: 28 },
  favoriteIconActive: { color: '#e55d7a' },
  weatherRow: { alignItems: 'center', flexDirection: 'row', marginTop: 14 },
  weatherIcon: { fontSize: 36, marginRight: 10 },
  temperatureBlock: { flex: 1 },
  temperature: { color: '#173b69', fontSize: 30, fontWeight: '300', letterSpacing: -1.2, lineHeight: 33 },
  condition: { color: '#6680a1', fontSize: 12 },
  rangeBlock: { alignItems: 'flex-end' },
  range: { color: '#6680a1', fontSize: 12, marginVertical: 1 },
});
