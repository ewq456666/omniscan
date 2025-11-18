import { useState, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/useThemeColors';
import { spacing } from '@/theme/spacing';
import { ContentCard } from '@/components/ContentCard';
import { TagChip } from '@/components/TagChip';
import { useMockDataStore } from '@/stores/useMockDataStore';

export function SearchScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ tag?: string }>();
  const { t } = useTranslation();
  const { content, categories } = useMockDataStore();
  const initialTag = typeof params.tag === 'string' ? params.tag : '';
  const [query, setQuery] = useState(initialTag);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeTag, setActiveTag] = useState<string | null>(initialTag || null);

  useEffect(() => {
    if (typeof params.tag === 'string') {
      setQuery(params.tag);
      setActiveTag(params.tag);
    }
  }, [params.tag]);

  const filtered = content.filter((item) => {
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery =
      normalizedQuery.length === 0 ||
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));
    const matchesCategory =
      activeCategory === 'All' || item.category === activeCategory;
    const matchesTag = !activeTag || item.tags.includes(activeTag);
    return matchesQuery && matchesCategory && matchesTag;
  });

  const categoryKeyMap: Record<string, string> = {
    All: 'all',
    Receipts: 'receipts',
    'Business Cards': 'businessCard',
    Notes: 'notes',
    Documents: 'documents',
  };

  const getCategoryLabel = (value: string) => {
    const key = categoryKeyMap[value];
    return key ? t(`search.categories.${key}`) : value;
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>{t('search.title')}</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('search.placeholder')}
          placeholderTextColor={colors.textMuted}
          accessibilityLabel={t('search.placeholder')}
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
              accessibilityLabel={t('common.accessibility.filterBy', { value: getCategoryLabel(item) })}
              accessibilityState={{ selected: item === activeCategory }}
            >
              <TagChip
                label={getCategoryLabel(item)}
                selected={item === activeCategory}
              />
            </TouchableOpacity>
          )}
          extraData={activeCategory}
        />
        {activeTag ? (
          <View style={styles.tagFilter}>
            <Text style={{ color: colors.textMuted, marginRight: spacing.xs }}>{t('search.tagPrefix')}</Text>
            <TagChip label={activeTag} selected />
            <TouchableOpacity
              onPress={() => setActiveTag(null)}
              style={{ marginLeft: spacing.sm }}
              accessibilityRole="button"
              accessibilityLabel={t('common.accessibility.clearTagFilter')}
            >
              <Text style={{ color: colors.primary, fontWeight: '600' }}>{t('search.clear')}</Text>
            </TouchableOpacity>
          </View>
        ) : null}
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
              {t('search.empty')}
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
  tagFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
});
