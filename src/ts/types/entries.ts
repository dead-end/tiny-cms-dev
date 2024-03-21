import type { TValidatorDefinition } from './validators'

export type TField = {
    id: string
    label: string
    component: string
    value?: string
    props?: Record<string, any>
    validators: TValidatorDefinition[]
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
 * The data of a collections
 */
export type TData = Record<string, any>

/**
 * Definition of an item in a collection.
 */
export type TItem = TEntry & {
    data: TData
}
