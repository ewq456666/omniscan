import React from 'react';
import { ReceiptTemplate } from './ReceiptTemplate';
import { BusinessCardTemplate } from './BusinessCardTemplate';
import { GenericTemplate } from './GenericTemplate';

export const templateRegistry: Record<string, React.ComponentType<any>> = {
    ReceiptTemplate,
    BusinessCardTemplate,
};

export function getTemplateComponent(componentName?: string) {
    return componentName ? templateRegistry[componentName] ?? GenericTemplate : GenericTemplate;
}
