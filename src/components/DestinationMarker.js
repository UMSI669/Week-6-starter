import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { colors, shadow } from '../theme/tokens';
import { getFoliageAppearance } from '../utils/foliageColors';

export function DestinationMarker({ selected, status = 'unknown' }) {
  const foliage = getFoliageAppearance(status);

  return (
    <View style={styles.shell}>
      <View
        style={[
          styles.pin,
          { backgroundColor: foliage.color },
          selected && styles.pinSelected,
        ]}
      >
        <Ionicons color={colors.surface} name="leaf" size={selected ? 24 : 20} />
      </View>
      <View
        style={[
          styles.point,
          { borderColor: foliage.color },
          selected && styles.pointSelected,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: 52,
    height: 64,
    alignItems: 'center',
  },
  pin: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.foliageUnknown,
    borderWidth: 3,
    borderColor: colors.surface,
    borderRadius: 22,
    transform: [{ rotate: '45deg' }],
    ...shadow,
  },
  pinSelected: {
    width: 48,
    height: 48,
    borderWidth: 4,
  },
  point: {
    width: 10,
    height: 10,
    marginTop: -2,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.foliageUnknown,
    borderRadius: 5,
  },
  pointSelected: {
    borderWidth: 3,
  },
});
