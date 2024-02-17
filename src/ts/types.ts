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

/**
 * Navigation entry
 */
export type TNavEntry = {
    label: string
    path: string
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
    path: string
    oid: string
    text: string
}

/**
 * If we want to update a file, we need the oid and the commit id.
 */
export type TCheckFile = {
    oid: string
    path: string
    commit: string
}

/**
 * The definition of an entry of a directory listing. This can be a collection
 * definition or a collection item. The type is used for tables.
 */
export type TEntry = {
    id: string
    title: string
    modified: number
}

/**
 * Definition of an item in a collection.
 */
export type TItem = TEntry & {
    data: any
}

/**
 * Definition of a collection definition.
 */
export type TDefinition = TEntry & {
    fields: TField[]
}

/**
 * With a commit id
 */
export type TCommit<T> = {
    data: T
    commit: string
}
