/**
 * Navigation entry
 */
export type TNavEntry = {
    label: string
    path: string
}

export type TValidatorDefinition = {
    validator: string
    props?: Record<string, any>
}

export type TField = {
    id: string
    label: string
    component: string
    value?: string
    props?: Record<string, any>
    validators: TValidatorDefinition[]
}

export type TDefinition = {
    label: string
    fields: TField[]
}

export type TItem = {
    id: string
    title: string
    modified: number
    data: any
}
