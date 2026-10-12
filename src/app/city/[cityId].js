import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getCityById } from '../../data/weatherCities';
import { selectFavoriteCityIds, toggleFavorite } from '../../store/weatherSlice';

function Metric({ icon, label, value }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricIcon}>{icon}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

export default function CityDetail() {
  const { cityId } = useLocalSearchParams();
  const city = getCityById(cityId);
  const dispatch = useDispatch();
  const favoriteCityIds = useSelector(selectFavoriteCityIds);

  if (!city) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <View style={styles.notFound}>
          <Text style={styles.notFoundIcon}>🌍</Text>
          <Text style={styles.notFoundTitle}>City not found</Text>
          <Text style={styles.notFoundCopy}>This weather record is not available.</Text>
          <Pressable onPress={() => router.back()} style={styles.backHomeButton}>
            <Text style={styles.backHomeText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const isFavorite = favoriteCityIds.includes(city.id);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable accessibilityLabel="Go back" hitSlop={10} onPress={() => router.back()} style={styles.iconButton}>
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>
          <Pressable
            accessibilityLabel={`Toggle ${city.name} favorite`}
            hitSlop={10}
            onPress={() => dispatch(toggleFavorite(city.id))}
            style={styles.iconButton}
          >
            <Text style={[styles.heartIcon, isFavorite && styles.heartIconActive]}>
              {isFavorite ? '♥' : '♡'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.summary}>
          <Text style={styles.cityName}>{city.name}</Text>
          <Text style={styles.country}>{city.country}</Text>
          <Text style={styles.weatherIcon}>{city.icon}</Text>
          <Text style={styles.temperature}>{city.temperature}°</Text>
          <Text style={styles.condition}>{city.condition}</Text>
        </View>

        <View style={styles.rangeCard}>
          <View>
            <Text style={styles.cardEyebrow}>TODAY’S RANGE</Text>
            <Text style={styles.rangeDescription}>A comfortable day ahead</Text>
          </View>
          <View style={styles.rangeValues}>
            <View>
              <Text style={styles.rangeLabel}>HIGH</Text>
              <Text style={styles.high}>{city.high}°</Text>
            </View>
            <View style={styles.rangeDivider} />
            <View>
              <Text style={styles.rangeLabel}>LOW</Text>
              <Text style={styles.low}>{city.low}°</Text>
            </View>
          </View>
        </View>

        <Text style={styles.metricsTitle}>DETAILS</Text>
        <View style={styles.metricsGrid}>
          <Metric icon="💧" label="HUMIDITY" value={`${city.humidity}%`} />
          <Metric icon="☔" label="RAIN CHANCE" value={`${city.rainChance}%`} />
          <Metric icon="〰️" label="WIND SPEED" value={`${city.wind} mph`} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#082b5b', flex: 1 },
  content: { padding: 20, paddingBottom: 42 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between' },
  iconButton: { alignItems: 'center', backgroundColor: '#194378', borderRadius: 18, height: 44, justifyContent: 'center', width: 44 },
  backIcon: { color: '#ffffff', fontSize: 37, fontWeight: '300', lineHeight: 39, marginTop: -5 },
  heartIcon: { color: '#9bc8ff', fontSize: 27 },
  heartIconActive: { color: '#ff91a8' },
  summary: { alignItems: 'center', paddingBottom: 36, paddingTop: 27 },
  cityName: { color: '#ffffff', fontSize: 32, fontWeight: '800', letterSpacing: -0.8 },
  country: { color: '#9bc8ff', fontSize: 14, marginTop: 3 },
  weatherIcon: { fontSize: 77, marginBottom: -1, marginTop: 23 },
  temperature: { color: '#ffffff', fontSize: 83, fontWeight: '200', letterSpacing: -5, lineHeight: 91, marginLeft: -6 },
  condition: { color: '#d9ecff', fontSize: 15, fontWeight: '600' },
  rangeCard: { alignItems: 'center', backgroundColor: '#1c5fa3', borderRadius: 24, flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
  cardEyebrow: { color: '#9bc8ff', fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  rangeDescription: { color: '#ffffff', fontSize: 14, fontWeight: '700', marginTop: 5 },
  rangeValues: { alignItems: 'center', flexDirection: 'row', gap: 13 },
  rangeLabel: { color: '#b7d8ff', fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  high: { color: '#ffcc78', fontSize: 26, fontWeight: '700', marginTop: 2 },
  low: { color: '#d9ecff', fontSize: 26, fontWeight: '700', marginTop: 2 },
  rangeDivider: { backgroundColor: '#5592cd', height: 39, width: 1 },
  metricsTitle: { color: '#b7c9e5', fontSize: 11, fontWeight: '800', letterSpacing: 1.4, marginBottom: 11, marginTop: 30 },
  metricsGrid: { flexDirection: 'row', gap: 10 },
  metric: { alignItems: 'center', backgroundColor: '#f7f9fd', borderRadius: 18, flex: 1, minHeight: 122, padding: 13 },
  metricIcon: { fontSize: 25, marginBottom: 10 },
  metricLabel: { color: '#6680a1', fontSize: 9, fontWeight: '800', letterSpacing: 0.5, textAlign: 'center' },
  metricValue: { color: '#173b69', fontSize: 19, fontWeight: '800', marginTop: 7 },
  notFound: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: 30 },
  notFoundIcon: { fontSize: 48 },
  notFoundTitle: { color: '#ffffff', fontSize: 24, fontWeight: '800', marginTop: 16 },
  notFoundCopy: { color: '#b7c9e5', fontSize: 14, marginTop: 6 },
  backHomeButton: { backgroundColor: '#f5f8fe', borderRadius: 14, marginTop: 24, paddingHorizontal: 20, paddingVertical: 12 },
  backHomeText: { color: '#163b6d', fontWeight: '800' },
});
