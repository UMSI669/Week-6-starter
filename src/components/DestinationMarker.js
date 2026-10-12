import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { colors, shadow } from '../theme/tokens';

export function DestinationMarker({ selected }) {
  return (
    <View style={styles.shell}>
      <View style={[styles.pin, selected && styles.pinSelected]}>
        <Ionicons color={colors.surface} name="leaf" size={selected ? 24 : 20} />
      </View>
      <View style={[styles.point, selected && styles.pointSelected]} />
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
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.surface,
    borderRadius: 22,
    transform: [{ rotate: '45deg' }],
    ...shadow,
  },
  pinSelected: {
    width: 48,
    height: 48,
    backgroundColor: colors.primaryDark,
  },
  point: {
    width: 10,
    height: 10,
    marginTop: -2,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 5,
  },
  pointSelected: {
    borderColor: colors.primaryDark,
  },
});
