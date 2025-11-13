import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useThemeColors } from '@/hooks/useThemeColors';
import { spacing } from '@/theme/spacing';
import { useMockDataStore } from '@/stores/useMockDataStore';
import { FieldCard } from '@/components/FieldCard';
import { TagChip } from '@/components/TagChip';
import { RootStackParamList } from '@/navigation/types';

export function ContentDetailScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { content } = useMockDataStore();
  const item = content[0];

  if (!item) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}> 
        <Text style={{ color: colors.text }}>No content available.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: spacing.xxl }}
    >
      <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
      <Text style={{ color: colors.textMuted }}>{item.category}</Text>
      <View style={styles.tagRow}>
        {item.tags.map((tag) => (
          <TagChip key={tag} label={tag} style={styles.tagChip} />
        ))}
      </View>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Extracted Data</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ContentEdit')}>
          <Text style={{ color: colors.primary }}>Edit</Text>
        </TouchableOpacity>
      </View>
      {item.fields.map((field) => (
        <FieldCard key={field.id} field={field} />
      ))}
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
    marginBottom: spacing.sm,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  tagChip: {
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
});
