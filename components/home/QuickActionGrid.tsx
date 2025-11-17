import { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { spacing } from '@/theme/spacing';
import { useThemeColors } from '@/hooks/useThemeColors';

export type QuickAction = {
  key: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  onPress: () => void;
  accentColor?: string;
  emphasis?: boolean;
};

type Props = {
  actions: QuickAction[];
};

export function QuickActionGrid({ actions }: Props) {
  const colors = useThemeColors();

  return (
    <View style={styles.grid}>
      {actions.map((action, index) => {
        const isPrimary = action.emphasis;
        const backgroundColor = isPrimary
          ? action.accentColor ?? colors.primary
          : colors.surface;
        const textColor = isPrimary ? '#FFFFFF' : colors.text;
        const subtitleColor = isPrimary ? 'rgba(255,255,255,0.85)' : colors.textMuted;

        return (
          <TouchableOpacity
            key={action.key}
            style={[
              styles.card,
              {
                backgroundColor,
                minHeight: isPrimary ? 156 : 132,
                flexBasis: index % 2 === 0 ? '48%' : '48%',
              },
            ]}
            onPress={action.onPress}
            accessibilityRole="button"
            accessibilityLabel={action.title}
            accessibilityHint={action.subtitle}
          >
            <View
              style={[
                styles.icon,
                { backgroundColor: isPrimary ? 'rgba(255,255,255,0.15)' : colors.surfaceAlt },
              ]}
            >
              {action.icon}
            </View>
            <Text style={[styles.title, { color: textColor }]}>{action.title}</Text>
            <Text style={[styles.subtitle, { color: subtitleColor }]}>{action.subtitle}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    borderRadius: 24,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  subtitle: {
    fontSize: 13,
    marginTop: spacing.xs,
  },
});
