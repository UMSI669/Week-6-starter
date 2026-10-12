import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { API_KEY, MISSING_KEY_MESSAGE, useLazySearchCitiesQuery } from '../services/openWeatherApi';
import { colors, radii, spacing, typography } from '../theme/tokens';
import { apiErrorMessage } from '../utils/apiErrorMessage';
import { formatCoordinates, formatGeocodeLabel } from '../utils/formatGeocodeLabel';
import OpenWeatherAttribution from './OpenWeatherAttribution';
import { Button, LoadingView, Message, sharedStyles } from './ui';

export default function CitySearch({ onChoose }) {
  const [query, setQuery] = useState('');
  const [validation, setValidation] = useState('');
  const [chosen, setChosen] = useState(-1);
  const [trigger, { currentData, isFetching, error, isUninitialized }] = useLazySearchCitiesQuery();
  const inFlight = useRef(false);
  const search = async () => {
    if (inFlight.current || isFetching || !API_KEY) return;
    const trimmed = query.trim();
    if (trimmed.length < 2) { setValidation('Enter at least 2 characters to search.'); return; }
    setValidation(''); setChosen(-1); inFlight.current = true;
    try { await trigger(trimmed, true); } finally { inFlight.current = false; }
  };
  const results = Array.isArray(currentData) ? currentData.slice(0, 5) : null;
  return <View style={styles.section}>
    <Text style={sharedStyles.eyebrow}>FIND A CITY</Text>
    <TextInput accessibilityLabel="Search city" autoCorrect={false} autoCapitalize="none" keyboardType="default" returnKeyType="search"
      value={query} onChangeText={setQuery} onSubmitEditing={search} placeholder="Search city, e.g. Ann Arbor,MI,US" placeholderTextColor={colors.placeholder} style={sharedStyles.input} />
    {Boolean(validation) && <Text accessibilityRole="alert" style={sharedStyles.error}>{validation}</Text>}
    <Button onPress={search} disabled={isFetching || !API_KEY}>Search</Button>
    {!API_KEY && <Message error>{MISSING_KEY_MESSAGE}</Message>}
    {isFetching && <LoadingView message="Searching places…" />}
    {error && <Message error>{apiErrorMessage(error)}</Message>}
    {results?.map((result, index) => {
      const coordinates = formatCoordinates(result);
      const label = formatGeocodeLabel(result) || 'Unnamed place';
      const usable = Boolean(coordinates.lat && coordinates.lon);
      return <Pressable accessibilityRole="button" accessibilityState={{ selected: chosen === index, disabled: !usable }} disabled={!usable} key={`${result?.lat}-${result?.lon}-${index}`}
        onPress={() => { setChosen(index); onChoose({ name: label, ...coordinates }); }} style={[styles.result, chosen === index && styles.chosen]}>
        <Text style={styles.name}>{chosen === index ? '✓ ' : ''}{label}</Text>
        <Text style={styles.coordinates}>{coordinates.lat || '—'}, {coordinates.lon || '—'}</Text>
      </Pressable>;
    })}
    {results?.length === 0 && !isFetching && <Message>No matching places. Try adding a country code (e.g. &apos;Paris,FR&apos;) or enter coordinates manually.</Message>}
    {!isUninitialized && results !== null && <OpenWeatherAttribution />}
  </View>;
}
const styles = StyleSheet.create({
  section: { gap: spacing.md },
  result: { backgroundColor: colors.surface, borderRadius: radii.button, padding: spacing.lg, minHeight: 64, borderWidth: 2, borderColor: colors.surface },
  chosen: { borderColor: colors.accent }, name: { ...typography.button, color: colors.text },
  coordinates: { ...typography.small, color: colors.metricLabel, marginTop: spacing.xs },
});
