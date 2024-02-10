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

/**
 * The definition of an entry of a directory listing on github.
 */
export type TListing = {
    name: string
    type: string
    oid: string
}

/**
 * The definition of a file with its content on github.
 */
export type TFile = {
    text: string
    oid: string
    path: string
}
