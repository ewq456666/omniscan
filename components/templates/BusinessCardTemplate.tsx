import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { CategoryDefinition } from '@/data/categoryDefinitions';
import { ExtractedField } from '@/data/mockData';
import { spacing } from '@/theme/spacing';
import { useThemeColors } from '@/hooks/useThemeColors';
import { gradients } from '@/theme/colors';

type Props = {
    definition: CategoryDefinition;
    fields: ExtractedField[];
};

const buildFieldMap = (fields: ExtractedField[]) =>
    fields.reduce<Record<string, ExtractedField>>((acc, field) => {
        acc[field.fieldId] = field;
        return acc;
    }, {});

export function BusinessCardTemplate({ definition, fields }: Props) {
    const colors = useThemeColors();
    const { t } = useTranslation();
    const fieldMap = buildFieldMap(fields);

    // Extract key fields
    const fullName = fieldMap['full_name'];
    const company = fieldMap['company'];
    const title = fieldMap['title'];
    const email = fieldMap['email'];
    const phoneNumber = fieldMap['phone_number'];
    const website = fieldMap['website'];
    const address = fieldMap['address'];
    const notes = fieldMap['notes'];

    const requiredSpecs = definition.requiredFields;
    const missingRequired = requiredSpecs.filter((spec) => {
        const field = fieldMap[spec.id];
        return !field || field.value === null || field.value === '';
    });

    const additionalFields = fields.filter(
        (field) =>
            !definition.requiredFields.some((spec) => spec.id === field.fieldId) &&
            !(definition.optionalFields ?? []).some((spec) => spec.id === field.fieldId),
    );

    return (
        <View style={{ marginTop: spacing.lg }}>
            {/* Card Container */}
            <View style={[styles.cardContainer, { backgroundColor: colors.surfaceAlt }]}>
                {/* Hero Name Section */}
                <LinearGradient
                    colors={gradients.primary as any}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.nameGradient}
                >
                    <Text style={styles.heroName}>
                        {fullName?.value || t('contentDetail.missingField')}
                    </Text>
                </LinearGradient>

                {/* Identity Section */}
                <View style={styles.identitySection}>
                    {title && (
                        <Text style={[styles.title, { color: colors.text }]}>
                            {title.value}
                        </Text>
                    )}
                    {company && (
                        <Text style={[styles.company, { color: colors.textMuted }]}>
                            {company.value}
                        </Text>
                    )}
                </View>

                {/* Contact Grid */}
                <View style={styles.contactGrid}>
                    {email && (
                        <View style={[styles.contactItem, { backgroundColor: colors.surface }]}>
                            <Text style={[styles.contactIcon, { color: colors.primary }]}>✉</Text>
                            <View style={styles.contactInfo}>
                                <Text style={[styles.contactLabel, { color: colors.textMuted }]}>
                                    {t('fields.email')}
                                </Text>
                                <Text style={[styles.contactValue, { color: colors.text }]} numberOfLines={1}>
                                    {email.value}
                                </Text>
                            </View>
                        </View>
                    )}

                    {phoneNumber && (
                        <View style={[styles.contactItem, { backgroundColor: colors.surface }]}>
                            <Text style={[styles.contactIcon, { color: colors.primary }]}>📞</Text>
                            <View style={styles.contactInfo}>
                                <Text style={[styles.contactLabel, { color: colors.textMuted }]}>
                                    {t('fields.phone')}
                                </Text>
                                <Text style={[styles.contactValue, { color: colors.text }]}>
                                    {phoneNumber.value}
                                </Text>
                            </View>
                        </View>
                    )}

                    {website && (
                        <View style={[styles.contactItem, { backgroundColor: colors.surface }]}>
                            <Text style={[styles.contactIcon, { color: colors.primary }]}>🌐</Text>
                            <View style={styles.contactInfo}>
                                <Text style={[styles.contactLabel, { color: colors.textMuted }]}>
                                    {t('fields.website')}
                                </Text>
                                <Text style={[styles.contactValue, { color: colors.text }]} numberOfLines={1}>
                                    {website.value}
                                </Text>
                            </View>
                        </View>
                    )}

                    {address && (
                        <View style={[styles.contactItem, { backgroundColor: colors.surface }]}>
                            <Text style={[styles.contactIcon, { color: colors.primary }]}>📍</Text>
                            <View style={styles.contactInfo}>
                                <Text style={[styles.contactLabel, { color: colors.textMuted }]}>
                                    {t('fields.address')}
                                </Text>
                                <Text style={[styles.contactValue, { color: colors.text }]} numberOfLines={2}>
                                    {address.value}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Notes */}
                {notes && (
                    <View style={styles.notesSection}>
                        <Text style={[styles.notesLabel, { color: colors.textMuted }]}>
                            {t('fields.notes')}
                        </Text>
                        <Text style={[styles.notesText, { color: colors.text }]}>
                            {notes.value}
                        </Text>
                    </View>
                )}
            </View>

            {/* Additional Fields */}
            {additionalFields.length > 0 && (
                <View style={{ marginTop: spacing.lg }}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        {t('contentDetail.additionalDetails')}
                    </Text>
                    {additionalFields.map((field) => (
                        <View key={field.id} style={[styles.additionalField, { backgroundColor: colors.surfaceAlt }]}>
                            <Text style={[styles.additionalLabel, { color: colors.textMuted }]}>
                                {field.label}
                            </Text>
                            <Text style={[styles.additionalValue, { color: colors.text }]}>
                                {field.value}
                            </Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Missing Required Warning */}
            {missingRequired.length > 0 && (
                <View style={[styles.warning, { backgroundColor: colors.surface, borderColor: colors.warning }]}>
                    <Text style={[styles.warningTitle, { color: colors.warning }]}>
                        {t('contentDetail.missingTitle')}
                    </Text>
                    <Text style={{ color: colors.textMuted }}>
                        {t('contentDetail.missingDescription')}
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: 20,
        padding: spacing.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    nameGradient: {
        padding: spacing.md,
        borderRadius: 12,
        marginBottom: spacing.md,
    },
    heroName: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    identitySection: {
        alignItems: 'center',
        marginBottom: spacing.lg,
        paddingBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    company: {
        fontSize: 16,
        fontWeight: '500',
    },
    contactGrid: {
        gap: spacing.sm,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 12,
        gap: spacing.sm,
    },
    contactIcon: {
        fontSize: 20,
    },
    contactInfo: {
        flex: 1,
    },
    contactLabel: {
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    contactValue: {
        fontSize: 15,
        fontWeight: '600',
    },
    notesSection: {
        marginTop: spacing.md,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    notesLabel: {
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: spacing.xs,
    },
    notesText: {
        fontSize: 14,
        lineHeight: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: spacing.sm,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    additionalField: {
        padding: spacing.md,
        borderRadius: 12,
        marginBottom: spacing.sm,
    },
    additionalLabel: {
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: spacing.xs,
    },
    additionalValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    warning: {
        borderRadius: 16,
        borderWidth: 1,
        padding: spacing.md,
        marginTop: spacing.lg,
    },
    warningTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
});
