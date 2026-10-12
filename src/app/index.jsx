import { router } from 'expo-router';
import { useRef } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import LocationDropdown from '../components/LocationDropdown';
import OpenWeatherAttribution from '../components/OpenWeatherAttribution';
import WeatherDetails from '../components/WeatherDetails';
import { Button, LoadingView, Message, sharedStyles } from '../components/ui';
import { deleteLocation, selectLocation } from '../features/locations/locationsSlice';
import { API_KEY, MISSING_KEY_MESSAGE, WEATHER_CACHE_SECONDS, useGetCurrentWeatherQuery } from '../services/openWeatherApi';
import { colors, radii, spacing, typography } from '../theme/tokens';
import { apiErrorMessage } from '../utils/apiErrorMessage';

function SelectedWeather({ location }) {
  const { currentData, isFetching, error, refetch } = useGetCurrentWeatherQuery({ lat: location.lat, lon: location.lon }, {
    skip: !API_KEY, refetchOnMountOrArgChange: WEATHER_CACHE_SECONDS, pollingInterval: 0,
    refetchOnFocus: false, refetchOnReconnect: false,
  });
  const refreshing = useRef(false);
  const refresh = async () => {
    if (!API_KEY || isFetching || refreshing.current) return;
    refreshing.current = true;
    try { await refetch(); } finally { refreshing.current = false; }
  };
  return <ScrollView contentContainerStyle={sharedStyles.content} alwaysBounceVertical
    refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refresh} tintColor={colors.secondary} colors={[colors.hero]} />}>
    {!API_KEY && <Message error>{MISSING_KEY_MESSAGE}</Message>}
    {API_KEY && isFetching && !currentData && <LoadingView />}
    {error && <Message error>{apiErrorMessage(error)}{currentData ? ' Showing cached weather.' : ''}</Message>}
    {currentData && <><WeatherDetails data={currentData} location={location} /><OpenWeatherAttribution /></>}
  </ScrollView>;
}

export default function WeatherScreen() {
  const { items, selectedId } = useSelector(/** @param {{locations: {items: {id: string, name: string, lat: number, lon: number}[], selectedId: string | null}}} state */ (state) => state.locations);
  const location = items.find((item) => item.id === selectedId);
  const dispatch = useDispatch();
  return <SafeAreaView style={sharedStyles.safeArea}>
    <View style={styles.header}>
      <View style={styles.heading}><View><Text style={sharedStyles.eyebrow}>YOUR DAILY WEATHER</Text><Text style={sharedStyles.title}>Weatherly</Text></View>
        <View style={styles.count}><Text style={styles.countNumber}>{items.length}</Text><Text style={styles.countLabel}>SAVED</Text></View></View>
      {items.length > 0 && <><LocationDropdown items={items} selectedId={selectedId} onSelect={(id) => dispatch(selectLocation(id))} onDelete={(id) => dispatch(deleteLocation(id))} />
        <Button onPress={() => router.push('/add-location')}>Add location</Button></>}
    </View>
    {location ? <SelectedWeather key={location.id} location={location} /> : <View style={styles.empty}>
      <Text style={styles.emptyTitle}>No saved locations</Text><Text style={sharedStyles.copy}>Add a city or enter coordinates to see its weather.</Text>
      <Button onPress={() => router.push('/add-location')}>Add location</Button>
    </View>}
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  header: { padding: spacing.xl, paddingBottom: spacing.xs, gap: spacing.md, maxWidth: 680, width: '100%', alignSelf: 'center' },
  heading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  count: { backgroundColor: colors.panel, borderRadius: radii.input, padding: spacing.sm, minWidth: 54, alignItems: 'center' },
  countNumber: { ...typography.heading, color: colors.accent }, countLabel: { ...typography.savedLabel, color: colors.muted },
  empty: { backgroundColor: colors.panel, borderRadius: radii.card, margin: spacing.xl, padding: spacing.xxl, gap: spacing.lg, maxWidth: 640, width: '90%', alignSelf: 'center' },
  emptyTitle: { ...typography.heading, color: colors.white },
});
