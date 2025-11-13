import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { spacing } from '@/theme/spacing';
import { SectionHeader } from '@/components/SectionHeader';

export function SettingsScreen() {
  const colors = useThemeColors();
  const [darkMode, setDarkMode] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [notifications, setNotifications] = useState(false);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: spacing.xxl }}
    >
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

      <SectionHeader title="Appearance" />
      <View style={[styles.row, { backgroundColor: colors.surface }]}> 
        <View>
          <Text style={[styles.rowTitle, { color: colors.text }]}>Dark mode</Text>
          <Text style={[styles.rowSubtitle, { color: colors.textMuted }]}> 
            Follows system preference
          </Text>
        </View>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>

      <SectionHeader title="Sync" />
      <View style={[styles.row, { backgroundColor: colors.surface }]}> 
        <View>
          <Text style={[styles.rowTitle, { color: colors.text }]}>Auto Sync</Text>
          <Text style={[styles.rowSubtitle, { color: colors.textMuted }]}> 
            Sync new scans when connected to Wi-Fi
          </Text>
        </View>
        <Switch value={autoSync} onValueChange={setAutoSync} />
      </View>

      <SectionHeader title="Notifications" />
      <View style={[styles.row, { backgroundColor: colors.surface }]}> 
        <View>
          <Text style={[styles.rowTitle, { color: colors.text }]}>
            Smart reminders
          </Text>
          <Text style={[styles.rowSubtitle, { color: colors.textMuted }]}> 
            Get notified about pending reviews
          </Text>
        </View>
        <Switch value={notifications} onValueChange={setNotifications} />
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
});
