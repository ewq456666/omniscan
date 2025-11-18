import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/useThemeColors';
import { spacing } from '@/theme/spacing';
import { SectionHeader } from '@/components/SectionHeader';
import { TagChip } from '@/components/TagChip';
import { LocalePreference, ThemePreference, useMockDataStore } from '@/stores/useMockDataStore';

export function SettingsScreen() {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const preferences = useMockDataStore((state) => state.preferences);
  const setThemePreference = useMockDataStore((state) => state.setThemePreference);
  const setLocalePreference = useMockDataStore((state) => state.setLocalePreference);
  const toggleAutoSync = useMockDataStore((state) => state.toggleAutoSync);
  const toggleNotifications = useMockDataStore((state) => state.toggleNotifications);

  const themeOptions: Array<{ label: string; value: ThemePreference; description: string }> = [
    {
      label: t('settings.theme.options.system.label'),
      value: 'system',
      description: t('settings.theme.options.system.description'),
    },
    {
      label: t('settings.theme.options.light.label'),
      value: 'light',
      description: t('settings.theme.options.light.description'),
    },
    {
      label: t('settings.theme.options.dark.label'),
      value: 'dark',
      description: t('settings.theme.options.dark.description'),
    },
  ];

  const languageOptions: Array<{ label: string; value: LocalePreference; description: string }> = [
    {
      label: t('settings.languagePreference.options.system.label'),
      value: 'system',
      description: t('settings.languagePreference.options.system.description'),
    },
    {
      label: t('settings.languagePreference.options.en.label'),
      value: 'en',
      description: t('settings.languagePreference.options.en.description'),
    },
    {
      label: t('settings.languagePreference.options.zh-TW.label'),
      value: 'zh-TW',
      description: t('settings.languagePreference.options.zh-TW.description'),
    },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        contentInsetAdjustmentBehavior="always"
      >
        <Text style={[styles.title, { color: colors.text }]}>{t('settings.title')}</Text>

        <SectionHeader title={t('settings.sections.appearance')} />
        <View style={[styles.row, { backgroundColor: colors.surface }]}>
          <View>
            <Text style={[styles.rowTitle, { color: colors.text }]}>{t('settings.theme.label')}</Text>
            <Text style={[styles.rowSubtitle, { color: colors.textMuted }]}>
              {t('settings.theme.description')}
            </Text>
          </View>
        </View>
        <View style={styles.themeOptions}>
          {themeOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setThemePreference(option.value)}
              accessibilityRole="button"
              accessibilityLabel={t('common.accessibility.themeOption', { label: option.label })}
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

        <SectionHeader title={t('settings.sections.language')} />
        <View style={[styles.row, { backgroundColor: colors.surface }]}>
          <View>
            <Text style={[styles.rowTitle, { color: colors.text }]}>
              {t('settings.languagePreference.label')}
            </Text>
            <Text style={[styles.rowSubtitle, { color: colors.textMuted }]}>
              {t('settings.languagePreference.description')}
            </Text>
          </View>
        </View>
        <View style={styles.themeOptions}>
          {languageOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setLocalePreference(option.value)}
              accessibilityRole="button"
              accessibilityLabel={t('common.accessibility.languageOption', { label: option.label })}
              accessibilityState={{ selected: preferences.locale === option.value }}
              style={styles.themeChipWrapper}
            >
              <TagChip label={option.label} selected={preferences.locale === option.value} />
              <Text style={[styles.themeDescription, { color: colors.textMuted }]}>
                {option.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <SectionHeader title={t('settings.sections.sync')} />
        <View style={[styles.row, { backgroundColor: colors.surface }]}>
          <View>
            <Text style={[styles.rowTitle, { color: colors.text }]}>{t('settings.autoSync.label')}</Text>
            <Text style={[styles.rowSubtitle, { color: colors.textMuted }]}>
              {t('settings.autoSync.description')}
            </Text>
          </View>
          <Switch
            value={preferences.autoSync}
            onValueChange={toggleAutoSync}
            accessibilityLabel={t('common.accessibility.toggleSync')}
          />
        </View>

        <SectionHeader title={t('settings.sections.notifications')} />
        <View style={[styles.row, { backgroundColor: colors.surface }]}>
          <View>
            <Text style={[styles.rowTitle, { color: colors.text }]}>
              {t('settings.notifications.label')}
            </Text>
            <Text style={[styles.rowSubtitle, { color: colors.textMuted }]}>
              {t('settings.notifications.description')}
            </Text>
          </View>
          <Switch
            value={preferences.notifications}
            onValueChange={toggleNotifications}
            accessibilityLabel={t('common.accessibility.toggleNotifications')}
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
