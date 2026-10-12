import { colors } from '../theme/tokens';

export const FOLIAGE_STATUSES = [
  { value: 'early', label: 'Early', color: colors.foliageEarly },
  { value: 'changing', label: 'Changing', color: colors.foliageChanging },
  { value: 'near-peak', label: 'Near Peak', color: colors.foliageNearPeak },
  { value: 'peak', label: 'Peak', color: colors.foliagePeak },
  { value: 'past-peak', label: 'Past Peak', color: colors.foliagePastPeak },
  { value: 'unknown', label: 'Unknown', color: colors.foliageUnknown },
];

export function getFoliageAppearance(status = 'unknown') {
  return (
    FOLIAGE_STATUSES.find((item) => item.value === status) ||
    FOLIAGE_STATUSES[FOLIAGE_STATUSES.length - 1]
  );
}
