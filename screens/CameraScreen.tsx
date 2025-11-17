import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing } from '@/theme/spacing';
import { useThemeColors } from '@/hooks/useThemeColors';
import { TagChip } from '@/components/TagChip';

const scanTypes = ['Auto Detect', 'Business Card', 'Receipt', 'Note'];

export function CameraScreen() {
  const colors = useThemeColors();
  const [activeScanType, setActiveScanType] = useState(scanTypes[0]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.previewWrapper}>
        <LinearGradient colors={['rgba(37,99,235,0.2)', 'transparent']} style={styles.gradient} />
        <View style={[styles.preview, { borderColor: colors.primary }]}>
          <Text style={[styles.previewText, { color: colors.textMuted }]}>
            Camera preview (mock)
          </Text>
        </View>
      </View>
      <View style={styles.scanTypeRow}>
        {scanTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={styles.scanTag}
            onPress={() => setActiveScanType(type)}
            accessibilityRole="button"
            accessibilityLabel={`Choose ${type} scan type`}
            accessibilityState={{ selected: activeScanType === type }}
          >
            <TagChip
              label={type}
              selected={activeScanType === type}
            />
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          accessibilityRole="button"
          accessibilityLabel="Toggle flash"
        >
          <MaterialCommunityIcons name="flash" color={colors.text} size={26} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.shutter, { borderColor: colors.primary }]}
          accessibilityRole="button"
          accessibilityLabel={`Capture ${activeScanType}`}
        >
          <View style={[styles.shutterInner, { backgroundColor: colors.primary }]} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlButton}
          accessibilityRole="button"
          accessibilityLabel="Open gallery"
        >
          <MaterialCommunityIcons name="image" color={colors.text} size={26} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  previewWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  preview: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderWidth: 2,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  previewText: {
    fontSize: 16,
  },
  scanTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  scanTag: {
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
});
