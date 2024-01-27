/**
 * Navigation entry
 */
export type TNavEntry = {
    label: string;
    path: string;
}

export type TFieldValidator = {
    validator: string;
    props?: Record<string, any>
}

export type TField = {
    id: string;
    label: string;
    component: string;
    value?: string;
    props?: Record<string, any>
    validators: TFieldValidator[];
}

export type TDefinition = {
    label: string;
    fields: TField[];
}