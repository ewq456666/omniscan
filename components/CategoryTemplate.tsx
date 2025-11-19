import { View } from 'react-native';
import { categoryDefinitions, CategoryId } from '@/data/categoryDefinitions';
import { ExtractedField } from '@/data/mockData';
import { spacing } from '@/theme/spacing';
import { FieldCard } from '@/components/FieldCard';
import { getTemplateComponent } from '@/components/templates/registry';

type Props = {
  category: CategoryId;
  fields: ExtractedField[];
};

export function CategoryTemplate({ category, fields }: Props) {
  const definition = categoryDefinitions[category];

  if (!definition) {
    return (
      <View style={{ marginTop: spacing.lg }}>
        {fields.map((field) => (
          <FieldCard key={field.id} field={field} />
        ))}
      </View>
    );
  }

  const TemplateComponent = getTemplateComponent(definition.presentation.component);

  return <TemplateComponent definition={definition} fields={fields} />;
}
