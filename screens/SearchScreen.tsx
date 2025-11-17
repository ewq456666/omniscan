import { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';
import { spacing } from '@/theme/spacing';
import { ContentCard } from '@/components/ContentCard';
import { TagChip } from '@/components/TagChip';
import { useMockDataStore } from '@/stores/useMockDataStore';

export function SearchScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { content, categories } = useMockDataStore();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filtered = content.filter((item) => {
    const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase());
    const matchesCategory =
      activeCategory === 'All' || item.category === activeCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Search</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search scans, fields or tags"
          placeholderTextColor={colors.textMuted}
          accessibilityLabel="Search scans, fields or tags"
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
        />
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingVertical: spacing.sm }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ marginRight: spacing.sm }}
              onPress={() =>
                setActiveCategory((current) => (current === item ? 'All' : item))
              }
              accessibilityRole="button"
              accessibilityLabel={`Filter by ${item}`}
              accessibilityState={{ selected: item === activeCategory }}
            >
              <TagChip
                label={item}
                selected={item === activeCategory}
              />
            </TouchableOpacity>
          )}
          extraData={activeCategory}
        />
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ContentCard
              item={item}
              onPress={() => router.push({ pathname: '/content-detail', params: { id: item.id } })}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: spacing.xxl }}
          ListEmptyComponent={
            <Text style={{ color: colors.textMuted, marginTop: spacing.lg }}>
              No results yet. Try adjusting your filters.
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  input: {
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    borderWidth: 1,
  },
});
