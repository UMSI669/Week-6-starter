import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radius, spacing, type } from '../theme/tokens';

const options = [25, 50, 100, 200, null];

export function DistanceFilter({
  visible,
  selectedDistance,
  hasLocation,
  onSelect,
  onClose,
  onRequestLocation,
}) {
  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.scrim}>
        <Pressable accessibilityLabel="Close distance filter" onPress={onClose} style={styles.dismissArea} />
        <SafeAreaView edges={['bottom']} style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.headingRow}>
            <View>
              <Text style={styles.eyebrow}>MAP FILTER</Text>
              <Text style={styles.title}>How far would you travel?</Text>
            </View>
            <Pressable
              accessibilityLabel="Close distance filter"
              accessibilityRole="button"
              hitSlop={8}
              onPress={onClose}
              style={styles.closeButton}
            >
              <Ionicons color={colors.text} name="close" size={24} />
            </Pressable>
          </View>

          {!hasLocation ? (
            <View style={styles.locationNotice}>
              <Ionicons color={colors.primary} name="navigate-circle-outline" size={28} />
              <View style={styles.noticeCopy}>
                <Text style={styles.noticeTitle}>Location needed</Text>
                <Text style={styles.noticeText}>
                  Distance filters use your current location. You can still choose Anywhere in Michigan.
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={onRequestLocation}
                style={({ pressed }) => [styles.locationButton, pressed && styles.pressed]}
              >
                <Text style={styles.locationButtonText}>Use location</Text>
              </Pressable>
            </View>
          ) : null}

          <View style={styles.options}>
            {options.map((option) => {
              const isAnywhere = option === null;
              const selected = selectedDistance === option;
              const disabled = !hasLocation && !isAnywhere;

              return (
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected, disabled }}
                  disabled={disabled}
                  key={isAnywhere ? 'anywhere' : option}
                  onPress={() => onSelect(option)}
                  style={({ pressed }) => [
                    styles.option,
                    selected && styles.optionSelected,
                    disabled && styles.optionDisabled,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                    {isAnywhere ? 'Anywhere in Michigan' : `Within ${option} miles`}
                  </Text>
                  <Ionicons
                    color={selected ? colors.primary : colors.border}
                    name={selected ? 'radio-button-on' : 'radio-button-off'}
                    size={24}
                  />
                </Pressable>
              );
            })}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.scrim,
  },
  dismissArea: {
    flex: 1,
  },
  sheet: {
    padding: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.pill,
    borderTopRightRadius: radius.pill,
  },
  handle: {
    width: 44,
    height: 4,
    alignSelf: 'center',
    marginBottom: spacing.xl,
    backgroundColor: colors.border,
    borderRadius: 2,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  eyebrow: {
    marginBottom: spacing.xs,
    color: colors.primary,
    fontSize: type.label,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  title: {
    color: colors.text,
    fontSize: type.title,
    fontWeight: '800',
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cream,
    borderRadius: 22,
  },
  locationNotice: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.warningSurface,
    borderRadius: radius.button,
    gap: spacing.sm,
  },
  noticeCopy: {
    gap: spacing.xs,
  },
  noticeTitle: {
    color: colors.text,
    fontSize: type.body,
    fontWeight: '700',
  },
  noticeText: {
    color: colors.textMuted,
    fontSize: type.small,
    lineHeight: 20,
  },
  locationButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.button,
  },
  locationButtonText: {
    color: colors.surface,
    fontSize: type.small,
    fontWeight: '700',
  },
  options: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  option: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: radius.button,
  },
  optionSelected: {
    backgroundColor: colors.warningSurface,
    borderColor: colors.gold,
  },
  optionDisabled: {
    opacity: 0.45,
  },
  optionText: {
    color: colors.text,
    fontSize: type.body,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: colors.primaryDark,
  },
  pressed: {
    opacity: 0.75,
  },
});
