import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import CityCard from '../components/CityCard';
import { citiesForIds, filterCities, getCityById } from '../data/weatherCities';
import {
  addRecentlyViewed,
  selectFavoriteCityIds,
  selectRecentlyViewedCityIds,
  toggleFavorite,
} from '../store/weatherSlice';

export default function WeatherDashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const favoriteCityIds = useSelector(selectFavoriteCityIds);
  const recentlyViewedCityIds = useSelector(selectRecentlyViewedCityIds);
  const [query, setQuery] = useState('');
  const [activeView, setActiveView] = useState('explore');

  const cities = useMemo(
    () =>
      activeView === 'favorites'
        ? citiesForIds(favoriteCityIds)
        : filterCities(query),
    [activeView, favoriteCityIds, query],
  );
  const recentlyViewedCities = recentlyViewedCityIds.map(getCityById).filter(Boolean);

  const openCity = (cityId) => {
    dispatch(addRecentlyViewed(cityId));
    router.push({ pathname: '/city/[cityId]', params: { cityId } });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>GOOD MORNING</Text>
            <Text style={styles.title}>Weatherly</Text>
          </View>
          <View style={styles.favoriteCount}>
            <Text style={styles.favoriteCountNumber}>{favoriteCityIds.length}</Text>
            <Text style={styles.favoriteCountLabel}>SAVED</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <View>
            <Text style={styles.heroLocation}>Ann Arbor, MI</Text>
            <Text style={styles.heroTemperature}>62°</Text>
            <Text style={styles.heroCondition}>Partly cloudy · Feels like 60°</Text>
          </View>
          <Text style={styles.heroIcon}>⛅</Text>
        </View>

        <TextInput
          accessibilityLabel="Search cities"
          autoCapitalize="words"
          onChangeText={setQuery}
          placeholder="Search city or country"
          placeholderTextColor="#7692b8"
          style={styles.searchInput}
          value={query}
        />

        <View style={styles.viewSwitch}>
          {['explore', 'favorites'].map((view) => (
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected: activeView === view }}
              key={view}
              onPress={() => setActiveView(view)}
              style={[styles.viewSwitchButton, activeView === view && styles.viewSwitchButtonActive]}
            >
              <Text style={[styles.viewSwitchText, activeView === view && styles.viewSwitchTextActive]}>
                {view === 'explore' ? 'Explore' : `Favorites (${favoriteCityIds.length})`}
              </Text>
            </Pressable>
          ))}
        </View>

        {activeView === 'explore' && recentlyViewedCities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RECENTLY VIEWED</Text>
            <ScrollView contentContainerStyle={styles.recentList} horizontal showsHorizontalScrollIndicator={false}>
              {recentlyViewedCities.map((city) => (
                <Pressable key={city.id} onPress={() => openCity(city.id)} style={styles.recentChip}>
                  <Text style={styles.recentIcon}>{city.icon}</Text>
                  <Text style={styles.recentCity}>{city.name}</Text>
                  <Text style={styles.recentTemperature}>{city.temperature}°</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{activeView === 'favorites' ? 'YOUR FAVORITES' : 'EXPLORE CITIES'}</Text>
          <Text style={styles.resultCount}>{cities.length} results</Text>
        </View>

        {cities.map((city) => (
          <CityCard
            city={city}
            isFavorite={favoriteCityIds.includes(city.id)}
            key={city.id}
            onOpen={openCity}
            onToggleFavorite={(cityId) => dispatch(toggleFavorite(cityId))}
          />
        ))}

        {cities.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>{activeView === 'favorites' ? '♡' : '🔎'}</Text>
            <Text style={styles.emptyTitle}>{activeView === 'favorites' ? 'No favorites yet' : 'No city found'}</Text>
            <Text style={styles.emptyCopy}>
              {activeView === 'favorites'
                ? 'Tap the heart on any city to save it here.'
                : 'Try searching for another city or country.'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#082b5b', flex: 1 },
  content: { padding: 20, paddingBottom: 42 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  eyebrow: { color: '#86a9d9', fontSize: 11, fontWeight: '700', letterSpacing: 1.6 },
  title: { color: '#ffffff', fontSize: 31, fontWeight: '800', letterSpacing: -0.8, marginTop: 2 },
  favoriteCount: { alignItems: 'center', backgroundColor: '#194378', borderRadius: 16, minWidth: 54, paddingHorizontal: 10, paddingVertical: 8 },
  favoriteCountNumber: { color: '#ffca73', fontSize: 19, fontWeight: '800' },
  favoriteCountLabel: { color: '#b7c9e5', fontSize: 8, fontWeight: '800', letterSpacing: 1 },
  hero: { alignItems: 'center', backgroundColor: '#1c5fa3', borderRadius: 28, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18, padding: 25 },
  heroLocation: { color: '#d9ecff', fontSize: 14, fontWeight: '700' },
  heroTemperature: { color: '#ffffff', fontSize: 68, fontWeight: '200', letterSpacing: -4, lineHeight: 76, marginLeft: -4 },
  heroCondition: { color: '#c8e5ff', fontSize: 13 },
  heroIcon: { fontSize: 70 },
  searchInput: { backgroundColor: '#f5f8fe', borderRadius: 15, color: '#163b6d', fontSize: 16, marginBottom: 18, paddingHorizontal: 17, paddingVertical: 15 },
  viewSwitch: { backgroundColor: '#194378', borderRadius: 15, flexDirection: 'row', marginBottom: 25, padding: 4 },
  viewSwitchButton: { alignItems: 'center', borderRadius: 11, flex: 1, paddingVertical: 10 },
  viewSwitchButtonActive: { backgroundColor: '#f5f8fe' },
  viewSwitchText: { color: '#b7c9e5', fontSize: 13, fontWeight: '800' },
  viewSwitchTextActive: { color: '#163b6d' },
  section: { marginBottom: 25 },
  sectionHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitle: { color: '#b7c9e5', fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  resultCount: { color: '#86a9d9', fontSize: 12 },
  recentList: { gap: 10, paddingTop: 11 },
  recentChip: { alignItems: 'center', backgroundColor: '#194378', borderRadius: 17, minWidth: 105, padding: 12 },
  recentIcon: { fontSize: 23, marginBottom: 4 },
  recentCity: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  recentTemperature: { color: '#9bc8ff', fontSize: 12, marginTop: 3 },
  emptyState: { alignItems: 'center', backgroundColor: '#194378', borderRadius: 20, padding: 28 },
  emptyEmoji: { fontSize: 28 },
  emptyTitle: { color: '#ffffff', fontSize: 17, fontWeight: '800', marginTop: 9 },
  emptyCopy: { color: '#b7c9e5', fontSize: 13, marginTop: 5, textAlign: 'center' },
});
