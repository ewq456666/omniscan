import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { CategoryDefinition, FieldSpec } from '@/data/categoryDefinitions';
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

export function ReceiptTemplate({ definition, fields }: Props) {
    const colors = useThemeColors();
    const { t } = useTranslation();
    const fieldMap = buildFieldMap(fields);

    // Extract key fields
    const merchantName = fieldMap['merchant_name'];
    const totalAmount = fieldMap['total_amount'];
    const transactionDate = fieldMap['transaction_date'];
    const taxAmount = fieldMap['tax_amount'];
    const paymentMethod = fieldMap['payment_method'];
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
            {/* Merchant Header */}
            <View style={[styles.merchantHeader, { backgroundColor: colors.surfaceAlt }]}>
                <Text style={[styles.merchantName, { color: colors.text }]}>
                    {merchantName?.value || t('contentDetail.missingField')}
                </Text>
                {transactionDate && (
                    <Text style={[styles.date, { color: colors.textMuted }]}>
                        {transactionDate.value}
                    </Text>
                )}
            </View>

            {/* Total Amount Hero Card */}
            {totalAmount && (
                <LinearGradient
                    colors={gradients.accent as any}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.totalCard}
                >
                    <Text style={styles.totalLabel}>{t('fields.total')}</Text>
                    <Text style={styles.totalAmount}>{totalAmount.value}</Text>
                    {totalAmount.confidence < 1 && (
                        <Text style={styles.totalConfidence}>
                            {t('common.confidence', { value: (totalAmount.confidence * 100).toFixed(0) })}
                        </Text>
                    )}
                </LinearGradient>
            )}

            {/* Payment Details Grid */}
            {(taxAmount || paymentMethod) && (
                <View style={{ marginTop: spacing.lg }}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        {t('receipt.section.payment')}
                    </Text>
                    <View style={styles.detailsGrid}>
                        {taxAmount && (
                            <View style={[styles.detailCard, { backgroundColor: colors.surfaceAlt }]}>
                                <Text style={[styles.detailLabel, { color: colors.textMuted }]}>
                                    {t('fields.tax')}
                                </Text>
                                <Text style={[styles.detailValue, { color: colors.text }]}>
                                    {taxAmount.value}
                                </Text>
                            </View>
                        )}
                        {paymentMethod && (
                            <View style={[styles.detailCard, { backgroundColor: colors.surfaceAlt }]}>
                                <Text style={[styles.detailLabel, { color: colors.textMuted }]}>
                                    {t('fields.paymentMethod')}
                                </Text>
                                <Text style={[styles.detailValue, { color: colors.text }]}>
                                    {paymentMethod.value}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            )}

            {/* Notes */}
            {notes && (
                <View style={[styles.notesCard, { backgroundColor: colors.surfaceAlt }]}>
                    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>
                        {t('fields.notes')}
                    </Text>
                    <Text style={[styles.notesText, { color: colors.text }]}>
                        {notes.value}
                    </Text>
                </View>
            )}

            {/* Additional Fields */}
            {additionalFields.length > 0 && (
                <View style={{ marginTop: spacing.lg }}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        {t('contentDetail.additionalDetails')}
                    </Text>
                    {additionalFields.map((field) => (
                        <View key={field.id} style={[styles.additionalField, { backgroundColor: colors.surfaceAlt }]}>
                            <Text style={[styles.detailLabel, { color: colors.textMuted }]}>
                                {field.label}
                            </Text>
                            <Text style={[styles.detailValue, { color: colors.text }]}>
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
    merchantHeader: {
        padding: spacing.md,
        borderRadius: 16,
        marginBottom: spacing.md,
    },
    merchantName: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: spacing.xs,
    },
    date: {
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    totalCard: {
        padding: spacing.lg,
        borderRadius: 20,
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.8)',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: spacing.xs,
    },
    totalAmount: {
        fontSize: 42,
        fontWeight: '800',
        color: '#FFFFFF',
        fontVariant: ['tabular-nums'],
    },
    totalConfidence: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: spacing.xs,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: spacing.sm,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    detailsGrid: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    detailCard: {
        flex: 1,
        padding: spacing.md,
        borderRadius: 12,
    },
    detailLabel: {
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: spacing.xs,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    notesCard: {
        padding: spacing.md,
        borderRadius: 12,
        marginTop: spacing.lg,
    },
    notesText: {
        fontSize: 15,
        lineHeight: 22,
    },
    additionalField: {
        padding: spacing.md,
        borderRadius: 12,
        marginBottom: spacing.sm,
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
