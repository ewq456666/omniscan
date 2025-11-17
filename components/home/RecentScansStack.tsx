import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing } from '@/theme/spacing';
import { useThemeColors } from '@/hooks/useThemeColors';
import { ScanItem } from '@/data/mockData';

type Props = {
  scans: ScanItem[];
  onPressLibrary: () => void;
  onPressScan: (scan: ScanItem) => void;
};

export function RecentScansStack({ scans, onPressLibrary, onPressScan }: Props) {
  const colors = useThemeColors();
  const topScans = scans.slice(0, 3);

  if (topScans.length === 0) {
    return (
      <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
        <Text style={{ color: colors.text, fontWeight: '600' }}>No scans yet</Text>
        <Text style={{ color: colors.textMuted, marginTop: spacing.xs }}>Capture your first document to see it here.</Text>
        <TouchableOpacity onPress={onPressLibrary} style={styles.emptyCta}>
          <Text style={{ color: colors.primary, fontWeight: '600' }}>Open Library</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View>
      <View style={{ marginBottom: spacing.sm, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[styles.heading, { color: colors.text }]}>Recent scans</Text>
        <TouchableOpacity onPress={onPressLibrary}>
          <Text style={{ color: colors.primary, fontWeight: '600' }}>View library</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.stackContainer} accessibilityRole="list">
        {topScans.map((scan, index) => (
          <TouchableOpacity
            key={scan.id}
            style={[
              styles.stackCard,
              {
                backgroundColor: colors.surface,
                top: index * 16,
                zIndex: topScans.length - index,
                shadowOpacity: 0.08 + index * 0.02,
              },
            ]}
            onPress={() => onPressScan(scan)}
            accessibilityRole="button"
            accessibilityLabel={`Open ${scan.title}`}
          >
            <ImageBackground
              source={{ uri: scan.thumbnail }}
              style={styles.thumbnail}
              imageStyle={{ borderRadius: 16 }}
            >
              <View style={styles.thumbnailOverlay} />
            </ImageBackground>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
                {scan.title}
              </Text>
              <Text style={{ color: colors.textMuted, marginTop: spacing.xs }} numberOfLines={1}>
                {scan.subtitle}
              </Text>
              <View style={styles.metaRow}>
                <MaterialCommunityIcons name="tag" color={colors.textMuted} size={14} />
                <Text style={{ color: colors.textMuted, marginLeft: spacing.xs, fontSize: 12 }}>
                  {scan.tags.join(', ')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: '600',
  },
  stackContainer: {
    position: 'relative',
    paddingTop: spacing.sm,
  },
  stackCard: {
    borderRadius: 24,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: spacing.md,
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    backgroundColor: 'rgba(15,23,42,0.25)',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  emptyState: {
    borderRadius: 24,
    padding: spacing.lg,
    alignItems: 'flex-start',
  },
  emptyCta: {
    marginTop: spacing.md,
  },
});
