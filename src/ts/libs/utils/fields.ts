// TODO: check if all fields have a default value and handle missing values.

import type { TData, TField } from '../../types/entries'

/**
 * The function initializes the data object with its default values.
 */
export const fieldsDefault = (fields: TField[]) => {
    const result: TData = {}
    fields.forEach((field) => (result[field.id] = field.value))
    return result
}
