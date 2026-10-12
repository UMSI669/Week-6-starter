import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../theme/tokens';
import { Button } from './ui';

export default function LocationDropdown({ items, selectedId, onSelect, onDelete }) {
  const [open, setOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(/** @type {{id: string, name: string} | null} */ (null));
  const selected = items.find((item) => item.id === selectedId);
  return <>
    <Button secondary onPress={() => setOpen(true)}>{selected?.name ?? 'Choose location'} ▾</Button>
    <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
      <View style={styles.overlay}>
        <View style={styles.modal} accessibilityViewIsModal>
          <Text style={styles.title}>Your locations</Text>
          <FlatList data={items} keyExtractor={(item) => item.id} style={styles.list} renderItem={({ item }) => (
            <View style={[styles.row, item.id === selectedId && styles.selected]}>
              <Pressable accessibilityRole="button" accessibilityState={{ selected: item.id === selectedId }} onPress={() => { onSelect(item.id); setOpen(false); }} style={styles.select}>
                <Text style={styles.name}>{item.name}</Text>
              </Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel={`Delete ${item.name}`} onPress={() => { setOpen(false); setPendingDelete(item); }} style={styles.delete}>
                <Text style={styles.deleteText}>X</Text>
              </Pressable>
            </View>
          )} />
          <Button secondary onPress={() => setOpen(false)}>Close</Button>
        </View>
      </View>
    </Modal>
    <Modal transparent visible={Boolean(pendingDelete)} animationType="fade" onRequestClose={() => setPendingDelete(null)}>
      <View style={styles.overlay}>
        <View style={styles.modal} accessibilityViewIsModal>
          <Text style={styles.title}>Delete {pendingDelete?.name}?</Text>
          <Text style={styles.copy}>This removes the location from your saved list.</Text>
          <View style={styles.actions}>
            <Button secondary style={styles.action} onPress={() => setPendingDelete(null)}>Cancel</Button>
            <Button destructive style={styles.action} onPress={() => { if (pendingDelete) onDelete(pendingDelete.id); setPendingDelete(null); }}>Delete</Button>
          </View>
        </View>
      </View>
    </Modal>
  </>;
}
const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'center', padding: spacing.xxl },
  modal: { backgroundColor: colors.background, borderRadius: radii.card, padding: spacing.xl, gap: spacing.lg, maxHeight: '85%', width: '100%', maxWidth: 520, alignSelf: 'center' },
  title: { ...typography.heading, color: colors.white }, copy: { ...typography.body, color: colors.muted },
  list: { flexGrow: 0 }, row: { flexDirection: 'row', alignItems: 'center', borderRadius: radii.sm, marginBottom: spacing.sm },
  selected: { backgroundColor: colors.panel }, select: { flex: 1, minHeight: 48, padding: spacing.md, justifyContent: 'center' },
  name: { ...typography.body, color: colors.heroText }, delete: { padding: spacing.md, minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  deleteText: { ...typography.button, color: colors.dangerText }, actions: { flexDirection: 'row', gap: spacing.md }, action: { flex: 1 },
});
