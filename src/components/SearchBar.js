import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { colors, radius, shadow, spacing, type } from '../theme/tokens';

export function SearchBar({ value, onChangeText, onFilterPress, filterActive }) {
  return (
    <View style={styles.row}>
      <View style={styles.searchShell}>
        <Ionicons color={colors.textMuted} name="search-outline" size={24} />
        <TextInput
          accessibilityLabel="Search Michigan destinations"
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
          onChangeText={onChangeText}
          placeholder="Search Michigan destinations..."
          placeholderTextColor={colors.textMuted}
          returnKeyType="search"
          style={styles.input}
          value={value}
        />
        {value ? (
          <Pressable
            accessibilityLabel="Clear search"
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => onChangeText('')}
          >
            <Ionicons color={colors.textMuted} name="close-circle" size={22} />
          </Pressable>
        ) : null}
      </View>
      <Pressable
        accessibilityLabel="Choose a distance filter"
        accessibilityRole="button"
        accessibilityState={{ selected: filterActive }}
        onPress={onFilterPress}
        style={({ pressed }) => [
          styles.filterButton,
          filterActive && styles.filterButtonActive,
          pressed && styles.pressed,
        ]}
      >
        <Ionicons
          color={filterActive ? colors.surface : colors.primary}
          name="options-outline"
          size={24}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  searchShell: {
    minHeight: 56,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    ...shadow,
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: spacing.md,
    color: colors.text,
    fontSize: type.body,
  },
  filterButton: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    ...shadow,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  pressed: {
    opacity: 0.75,
  },
});
