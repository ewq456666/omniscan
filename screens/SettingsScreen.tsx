import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';
import { spacing } from '@/theme/spacing';
import { SectionHeader } from '@/components/SectionHeader';
import { TagChip } from '@/components/TagChip';
import { ThemePreference, useMockDataStore } from '@/stores/useMockDataStore';

export function SettingsScreen() {
  const colors = useThemeColors();
  const { preferences, setThemePreference, toggleAutoSync, toggleNotifications } = useMockDataStore(
    (state) => ({
      preferences: state.preferences,
      setThemePreference: state.setThemePreference,
      toggleAutoSync: state.toggleAutoSync,
      toggleNotifications: state.toggleNotifications,
    }),
  );

  const themeOptions: Array<{ label: string; value: ThemePreference; description: string }> = [
    { label: 'System', value: 'system', description: 'Follow device appearance' },
    { label: 'Light', value: 'light', description: 'Bright surfaces, dark text' },
    { label: 'Dark', value: 'dark', description: 'Dim surfaces, high contrast' },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        contentInsetAdjustmentBehavior="always"
      >
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

        <SectionHeader title="Appearance" />
        <View style={[styles.row, { backgroundColor: colors.surface }]}>
          <View>
            <Text style={[styles.rowTitle, { color: colors.text }]}>Theme</Text>
            <Text style={[styles.rowSubtitle, { color: colors.textMuted }]}>
              Choose how OmniScan renders surfaces
            </Text>
          </View>
        </View>
        <View style={styles.themeOptions}>
          {themeOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setThemePreference(option.value)}
              accessibilityRole="button"
              accessibilityLabel={`${option.label} theme`}
              accessibilityState={{ selected: preferences.theme === option.value }}
              style={styles.themeChipWrapper}
            >
              <TagChip label={option.label} selected={preferences.theme === option.value} />
              <Text style={[styles.themeDescription, { color: colors.textMuted }]}>
                {option.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <SectionHeader title="Sync" />
        <View style={[styles.row, { backgroundColor: colors.surface }]}>
          <View>
            <Text style={[styles.rowTitle, { color: colors.text }]}>Auto Sync</Text>
            <Text style={[styles.rowSubtitle, { color: colors.textMuted }]}>
              Sync new scans when connected to Wi-Fi
            </Text>
          </View>
          <Switch
            value={preferences.autoSync}
            onValueChange={toggleAutoSync}
            accessibilityLabel="Toggle automatic sync"
          />
        </View>

        <SectionHeader title="Notifications" />
        <View style={[styles.row, { backgroundColor: colors.surface }]}>
          <View>
            <Text style={[styles.rowTitle, { color: colors.text }]}>Smart reminders</Text>
            <Text style={[styles.rowSubtitle, { color: colors.textMuted }]}>
              Get notified about pending reviews
            </Text>
          </View>
          <Switch
            value={preferences.notifications}
            onValueChange={toggleNotifications}
            accessibilityLabel="Toggle smart reminders"
          />
        </View>
      </ScrollView>
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
  row: {
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  rowSubtitle: {
    marginTop: spacing.xs,
    fontSize: 13,
  },
  themeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  themeChipWrapper: {
    width: '30%',
    marginBottom: spacing.md,
  },
  themeDescription: {
    marginTop: spacing.xs,
    fontSize: 12,
  },
});
