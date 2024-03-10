import type { TField } from './types'

/**
 * Definition of the is field.
 */
const idField = {
    id: 'tc_id',
    component: 'text',
    label: 'Id',
    validators: [
        {
            validator: 'required'
        },
        {
            validator: 'max',
            props: {
                max: 32
            }
        }
    ]
}

/**
 * Definition of the title field.
 */
const titleField = {
    id: 'tc_title',
    component: 'text',
    label: 'Title',
    validators: [
        {
            validator: 'required'
        },
        {
            validator: 'max',
            props: {
                max: 32
            }
        }
    ]
}

/**
 * The function returns the meta data for an item.
 */
export const entryGet = (isCreate: boolean) => {
    const fields: TField[] = []
    if (isCreate) {
        fields.push(idField)
    }

    fields.push(titleField)
    return fields
}
