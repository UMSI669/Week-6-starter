import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../theme/tokens';
import { formatLocalTime } from '../utils/formatLocalTime';
import { formatNumber, formatTemperature, formatWindSpeed } from '../utils/formatWeather';
import { windDirection } from '../utils/windDirection';

function Metric({ label, value }) {
  return <View style={styles.metric}><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricValue}>{value}</Text></View>;
}

export default function WeatherDetails({ data, location }) {
  const condition = data?.weather?.[0];
  const atmosphere = data?.main;
  const metrics = [
    ['HUMIDITY', formatNumber(atmosphere?.humidity, '%')],
    ['PRESSURE', formatNumber(atmosphere?.pressure, ' hPa')],
    ['WIND SPEED', formatWindSpeed(data?.wind?.speed)],
    ['WIND DIRECTION', windDirection(data?.wind?.deg)],
    ['VISIBILITY', formatNumber(Number.isFinite(data?.visibility) ? data.visibility / 1000 : undefined, ' km', 1)],
    ['CLOUD COVER', formatNumber(data?.clouds?.all, '%')],
  ];
  for (const [label, value, unit, decimals] of [
    ['SEA LEVEL', atmosphere?.sea_level, ' hPa', 0],
    ['GROUND LEVEL', atmosphere?.grnd_level, ' hPa', 0],
    ['WIND GUST', data?.wind?.gust, null, 1],
    ['RAIN · LAST HOUR', data?.rain?.['1h'], ' mm', 1],
    ['SNOW · LAST HOUR', data?.snow?.['1h'], ' mm', 1],
  ]) {
    if (Number.isFinite(value)) metrics.push([label, unit === null ? formatWindSpeed(value) : formatNumber(value, unit, decimals)]);
  }
  return <View style={styles.details}>
    <View style={styles.hero}>
      <Text style={styles.name}>{location.name}</Text>
      <Text style={styles.secondary}>{[data?.name, data?.sys?.country].filter(Boolean).join(', ')}</Text>
      <View style={styles.weatherRow}>
        <Text style={styles.temperature}>{formatTemperature(atmosphere?.temp)}</Text>
        {condition?.icon && <Image accessibilityLabel={condition.description ?? condition.main ?? 'Weather condition'} source={{ uri: `https://openweathermap.org/img/wn/${encodeURIComponent(condition.icon)}@2x.png` }} style={styles.icon} />}
      </View>
      {condition?.main && <Text style={styles.condition}>{condition.main}</Text>}
      {condition?.description && <Text style={styles.secondary}>{condition.description}</Text>}
      <Text style={styles.secondary}>Feels like {formatTemperature(atmosphere?.feels_like)}</Text>
    </View>
    <View style={styles.range}>
      <Text style={styles.eyebrow}>CURRENT RANGE</Text>
      <View style={styles.rangeValues}>
        <Text style={styles.high}>HIGH {formatTemperature(atmosphere?.temp_max)}</Text>
        <Text style={styles.low}>LOW {formatTemperature(atmosphere?.temp_min)}</Text>
      </View>
    </View>
    <Text style={styles.eyebrow}>DETAILS</Text>
    <View style={styles.grid}>{metrics.map(([label, value]) => <Metric key={label} label={label} value={value} />)}</View>
    <View style={styles.times}>
      <Text style={styles.time}>Sunrise · {formatLocalTime(data?.sys?.sunrise, data?.timezone)}</Text>
      <Text style={styles.time}>Sunset · {formatLocalTime(data?.sys?.sunset, data?.timezone)}</Text>
      <Text style={styles.time}>Last updated · {formatLocalTime(data?.dt, data?.timezone, true)}</Text>
      <Text style={styles.secondary}>Times are local to this location.</Text>
    </View>
  </View>;
}
const styles = StyleSheet.create({
  details: { gap: spacing.lg },
  hero: { backgroundColor: colors.hero, borderRadius: radii.hero, padding: spacing.xxl, gap: spacing.xs },
  name: { ...typography.heading, color: colors.heroText }, secondary: { ...typography.body, color: colors.heroText },
  weatherRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' },
  temperature: { ...typography.temperature, color: colors.white }, icon: { width: 90, height: 90 },
  condition: { ...typography.heading, color: colors.white },
  range: { backgroundColor: colors.hero, borderRadius: radii.card, padding: spacing.xl, gap: spacing.md },
  rangeValues: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing.md },
  high: { ...typography.heading, color: colors.accent }, low: { ...typography.heading, color: colors.heroText },
  eyebrow: { ...typography.eyebrow, color: colors.muted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  metric: { backgroundColor: colors.surface, borderRadius: radii.button, flexGrow: 1, flexBasis: '45%', minHeight: 100, padding: spacing.lg, justifyContent: 'center', alignItems: 'center' },
  metricLabel: { ...typography.eyebrow, color: colors.metricLabel, textAlign: 'center' },
  metricValue: { ...typography.heading, color: colors.text, marginTop: spacing.sm, textAlign: 'center' },
  times: { backgroundColor: colors.panel, borderRadius: radii.button, padding: spacing.lg, gap: spacing.sm },
  time: { ...typography.body, color: colors.white },
});
