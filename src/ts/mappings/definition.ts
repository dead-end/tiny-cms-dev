import { formDataStr } from '../libs/utils/formData'
import type { TData, TDefinition } from '../types'

/**
 * The function maps the entry part of a definition to a map.
 */
export const definitionEntryToData = (
    isCreate: boolean,
    definition: TDefinition,
    data: TData
) => {
    if (isCreate) {
        data['tc_id'] = definition.tc_id
    }
    data['tc_title'] = definition.tc_title

    return data
}

/**
 * The function updates the entry part of a definition from form data.
 */
export const definitionEntryFromFormData = (
    definition: TDefinition,
    isCreate: boolean,
    formData: FormData
) => {
    if (isCreate) {
        definition.tc_id = formDataStr(formData, 'tc_id', 'No id')
    }
    definition.tc_title = formDataStr(formData, 'tc_title', 'No title')

    return definition
}
