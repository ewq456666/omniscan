import { FlatList, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { spacing } from '@/theme/spacing';
import { useMockDataStore } from '@/stores/useMockDataStore';

export function GalleryScreen() {
  const colors = useThemeColors();
  const { scans } = useMockDataStore();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Text style={[styles.title, { color: colors.text }]}>Gallery</Text>
      <FlatList
        data={scans}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.cardWrapper,
              index % 2 === 0 ? styles.cardWrapperSpacing : undefined,
            ]}
          >
            <ImageBackground
              source={{ uri: item.thumbnail }}
              style={styles.card}
              imageStyle={{ borderRadius: 18 }}
            >
              <View style={[styles.overlay, { backgroundColor: 'rgba(15,23,42,0.45)' }]}>
                <Text style={[styles.cardTitle, { color: '#FFFFFF' }]} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={[styles.cardSubtitle, { color: '#E5E7EB' }]} numberOfLines={1}>
                  {item.subtitle}
                </Text>
              </View>
            </ImageBackground>
          </View>
        )}
      />
    </View>
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
  card: {
    flex: 1,
    height: 180,
    justifyContent: 'flex-end',
  },
  cardWrapper: {
    flex: 1,
    marginBottom: spacing.md,
  },
  cardWrapperSpacing: {
    marginRight: spacing.md,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
  },
  overlay: {
    borderRadius: 18,
    padding: spacing.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardSubtitle: {
    marginTop: spacing.xs,
    fontSize: 13,
  },
});
