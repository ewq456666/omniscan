import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { spacing } from '@/theme/spacing';
import { useMockDataStore } from '@/stores/useMockDataStore';
import { FieldCard } from '@/components/FieldCard';
import { TagChip } from '@/components/TagChip';

export function ResultsScreen() {
  const colors = useThemeColors();
  const { extractedFields, tags } = useMockDataStore();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: spacing.xxl }}
    >
      <Text style={[styles.title, { color: colors.text }]}>Review Results</Text>
      <View style={[styles.preview, { backgroundColor: colors.surface }]}> 
        <Text style={{ color: colors.textMuted }}>Captured image preview</Text>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Extracted Fields</Text>
      {extractedFields.map((field) => (
        <FieldCard key={field.id} field={field} />
      ))}

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Suggested Tags</Text>
      <View style={styles.tagGrid}>
        {tags.map((tag) => (
          <TagChip key={tag} label={tag} style={styles.tagChip} />
        ))}
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={[styles.actionButton, { borderColor: colors.border }]}> 
          <MaterialCommunityIcons name="share" color={colors.text} size={20} />
          <Text style={[styles.actionText, { color: colors.text }]}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonTrailing, { borderColor: colors.border }]}
        >
          <MaterialCommunityIcons name="content-save" color={colors.text} size={20} />
          <Text style={[styles.actionText, { color: colors.text }]}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  preview: {
    height: 220,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: spacing.md,
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  tagChip: {
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  actionButtonTrailing: {
    marginLeft: spacing.sm,
  },
});
