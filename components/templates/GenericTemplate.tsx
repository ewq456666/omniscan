import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CategoryDefinition, FieldSpec } from '@/data/categoryDefinitions';
import { ExtractedField } from '@/data/mockData';
import { spacing } from '@/theme/spacing';
import { useThemeColors } from '@/hooks/useThemeColors';
import { FieldCard } from '@/components/FieldCard';

type Props = {
    definition?: CategoryDefinition;
    fields: ExtractedField[];
};

const buildFieldMap = (fields: ExtractedField[]) =>
    fields.reduce<Record<string, ExtractedField>>((acc, field) => {
        acc[field.fieldId] = field;
        return acc;
    }, {});

export function GenericTemplate({ definition, fields }: Props) {
    const colors = useThemeColors();
    const { t } = useTranslation();

    if (!definition) {
        return (
            <View style={{ marginTop: spacing.lg }}>
                {fields.map((field) => (
                    <FieldCard key={field.id} field={field} />
                ))}
            </View>
        );
    }

    const fieldMap = buildFieldMap(fields);
    const requiredSpecs = definition.requiredFields;
    const missingRequired = requiredSpecs.filter((spec) => {
        const field = fieldMap[spec.id];
        return !field || field.value === null || field.value === '';
    });

    const renderField = (spec: FieldSpec) => {
        const field = fieldMap[spec.id];
        if (field) {
            return <FieldCard key={spec.id} field={field} />;
        }
        return (
            <View key={spec.id} style={[styles.missingField, { borderColor: colors.border }]}>
                <Text style={[styles.missingLabel, { color: colors.text }]}>{t(spec.labelKey)}</Text>
                <Text style={{ color: colors.textMuted }}>{t('contentDetail.missingField')}</Text>
            </View>
        );
    };

    const additionalFields = fields.filter(
        (field) =>
            !definition.requiredFields.some((spec) => spec.id === field.fieldId) &&
            !(definition.optionalFields ?? []).some((spec) => spec.id === field.fieldId),
    );

    return (
        <View style={{ marginTop: spacing.lg }}>
            {definition.presentation.sections.map((section) => (
                <View key={section.titleKey} style={{ marginBottom: spacing.lg }}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>{t(section.titleKey)}</Text>
                    {section.fieldIds.map((fieldId) => {
                        const spec =
                            definition.requiredFields.find((item) => item.id === fieldId) ??
                            definition.optionalFields?.find((item) => item.id === fieldId);
                        return spec ? renderField(spec) : null;
                    })}
                </View>
            ))}

            {additionalFields.length > 0 ? (
                <View>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('contentDetail.additionalDetails')}</Text>
                    {additionalFields.map((field) => (
                        <FieldCard key={field.id} field={field} />
                    ))}
                </View>
            ) : null}

            {missingRequired.length > 0 ? (
                <View style={[styles.warning, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.warningTitle, { color: colors.warning }]}>{t('contentDetail.missingTitle')}</Text>
                    <Text style={{ color: colors.textMuted }}>{t('contentDetail.missingDescription')}</Text>
                </View>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: spacing.sm,
    },
    missingField: {
        borderWidth: 1,
        borderRadius: 16,
        padding: spacing.md,
        marginBottom: spacing.sm,
    },
    missingLabel: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    warning: {
        borderRadius: 16,
        padding: spacing.md,
        marginTop: spacing.lg,
    },
    warningTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
});
