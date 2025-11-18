import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/useThemeColors';
import { spacing } from '@/theme/spacing';
import { useMockDataStore } from '@/stores/useMockDataStore';
import { ContentCard } from '@/components/ContentCard';

export function ContentListScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { t } = useTranslation();
  const { content } = useMockDataStore();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>{t('contentList.title')}</Text>
        <FlatList
          data={content}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ContentCard
              item={item}
              onPress={() => router.push({ pathname: '/content-detail', params: { id: item.id } })}
            />
          )}
          contentContainerStyle={{ paddingBottom: spacing.xxl }}
          showsVerticalScrollIndicator={false}
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
});
