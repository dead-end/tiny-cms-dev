import type { TValidatorDefinition } from './types/validators'

export type TField = {
    id: string
    label: string
    component: string
    value?: string
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
    oid: string | null
    path: string
    commit: string
}

/**
 * The definition of an entry of a directory listing. This can be a collection
 * definition or a collection item. The type is used for tables.
 */
export type TEntry = {
    tc_id: string
    tc_title: string
    tc_modified: number
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

/**
 * The data of a collections
 */
export type TData = Record<string, any>

/**
 * Definition of an item in a collection.
 */
export type TItem = TEntry & {
    data: TData
}

/**
 * Definition of a button for the popup window.
 */
export type TButton = {
    label: string
    onclick: () => void
}

/**
 * Definition of the component for an input field.
 */
export type TComponent = {
    component: any
    validators: string[]
}
