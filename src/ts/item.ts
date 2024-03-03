import { formDataStr } from './libs/utils/formData'
import type { TData, TField, TItem } from './types'

/**
 * The function is called with an item object and maps it to a flat map.
 */
export const itemToData = (isCreate: boolean, item: TItem, data: TData) => {
    if (isCreate) {
        data['tc_id'] = item.tc_id
    }
    data['tc_title'] = item.tc_title

    for (const key in item.data) {
        data[key] = item.data[key]
    }
    return data
}

/**
 * The function is called with form data and maps it to an item instance.
 */
export const itemFromFormData = (
    item: TItem,
    isCreate: boolean,
    formData: FormData,
    fields: TField[]
) => {
    let tmp

    if (isCreate) {
        item.tc_id = formDataStr(formData, 'tc_id', 'No id')
    }
    item.tc_title = formDataStr(formData, 'tc_title', 'No title')

    fields.forEach((field) => {
        item.data[field.id] = formData.get(field.id)
    })

    return item
}
