import Result from './libs/result'
import type { TField, TItem } from './types'

export const item2Data = (item: TItem, itemData: Record<string, string>) => {
    itemData = item.data
    return itemData
}

export const item2Meta = (
    isCreate: boolean,
    item: TItem,
    metaData: Record<string, string>
) => {
    if (isCreate) {
        metaData['tc_id'] = item.tc_id
    }
    metaData['tc_title'] = item.tc_title
    return metaData
}

export const itemFromFormData = (
    item: TItem,
    isCreate: boolean,
    formData: FormData,
    fields: TField[]
) => {
    const res = new Result<TItem>()
    let tmp

    if (isCreate) {
        tmp = formData.get('tc_id')
        if (!tmp) {
            return res.failed('No id')
        }
        item.tc_id = tmp as string
    }
    tmp = formData.get('tc_title')
    if (!tmp) {
        return res.failed('No title')
    }
    item.tc_title = tmp as string

    fields.forEach((field) => {
        item.data[field.id] = formData.get(field.id)
    })

    return res.success(item)
}
