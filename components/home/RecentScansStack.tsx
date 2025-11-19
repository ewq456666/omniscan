import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { spacing } from '@/theme/spacing';
import { useThemeColors } from '@/hooks/useThemeColors';
import { ScanItem } from '@/data/mockData';

type Props = {
  scans: ScanItem[];
  onPressLibrary: () => void;
  onPressScan: (scan: ScanItem) => void;
};

const CARD_HEIGHT = 110;
const STACK_OFFSET = 18;

export function RecentScansStack({ scans, onPressLibrary, onPressScan }: Props) {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const topScans = scans.slice(0, 3);
  const stackHeight = CARD_HEIGHT + STACK_OFFSET * Math.max(topScans.length - 1, 0);

  if (topScans.length === 0) {
    return (
      <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
        <Text style={{ color: colors.text, fontWeight: '600' }}>{t('common.noScans')}</Text>
        <Text style={{ color: colors.textMuted, marginTop: spacing.xs }}>{t('common.captureFirst')}</Text>
        <TouchableOpacity onPress={onPressLibrary} style={styles.emptyCta}>
          <Text style={{ color: colors.primary, fontWeight: '600' }}>{t('common.openLibrary')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View>
      <View style={{ marginBottom: spacing.sm, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[styles.heading, { color: colors.text }]}>{t('common.recentScans')}</Text>
        <TouchableOpacity onPress={onPressLibrary}>
          <Text style={{ color: colors.primary, fontWeight: '600' }}>{t('common.viewLibrary')}</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.stackContainer, { height: stackHeight }]} accessibilityRole="list">
        {topScans.map((scan, index) => (
          <TouchableOpacity
            key={scan.id}
            style={[
              styles.stackCard,
              {
                backgroundColor: colors.surface,
                top: index * STACK_OFFSET,
                zIndex: topScans.length - index,
                shadowOpacity: 0.08 + index * 0.02,
              },
            ]}
            onPress={() => onPressScan(scan)}
            accessibilityRole="button"
            accessibilityLabel={t('common.accessibility.openItem', { title: scan.title })}
          >
            <ImageBackground
              source={{ uri: scan.thumbnailUri }}
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
                  {(scan.tags || []).join(', ')}
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
    height: CARD_HEIGHT,
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
