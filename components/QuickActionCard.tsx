import { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing } from '@/theme/spacing';
import { useThemeColors } from '@/hooks/useThemeColors';
import { gradients } from '@/theme/colors';

interface Props {
  title: string;
  subtitle: string;
  icon: ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'primary';
  accentColor?: string;
}

export function QuickActionCard({
  title,
  subtitle,
  icon,
  onPress,
  variant = 'default',
  accentColor,
}: Props) {
  const colors = useThemeColors();
  const textColor = variant === 'primary' ? '#FFFFFF' : colors.text;
  const subtitleColor = variant === 'primary' ? 'rgba(255,255,255,0.8)' : colors.textMuted;
  const iconBackground = variant === 'primary'
    ? styles.iconPrimary.backgroundColor
    : accentColor ?? colors.primary;
  const isInteractive = typeof onPress === 'function';

  const content = (
    <>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: iconBackground },
        ]}
      >
        {icon}
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: subtitleColor }]}>{subtitle}</Text>
      </View>
    </>
  );

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole={isInteractive ? 'button' : undefined}
      accessibilityLabel={title}
      accessibilityHint={subtitle}
      disabled={!isInteractive}
    >
      {variant === 'primary' ? (
        <LinearGradient
          colors={gradients.capture}
          style={styles.container}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {content}
        </LinearGradient>
      ) : (
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          {content}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 16,
    marginRight: spacing.md,
    overflow: 'hidden',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconPrimary: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    marginTop: spacing.xs,
  },
});
