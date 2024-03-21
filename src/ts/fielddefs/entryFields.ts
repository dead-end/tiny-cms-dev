import type { TField } from '../types/entries'

/**
 * Definition of the id field of an entry.
 */
const FIdField: TField = {
    id: 'tc_id',
    component: 'text',
    label: 'Id',
    validators: [
        {
            validator: 'required'
        },
        {
            validator: 'regex',
            props: {
                regex: '^[a-zA-Z0-9_-]*$'
            }
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
 * Definition of the title field of an Entry.
 */
const FTitleField: TField = {
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
                max: 64
            }
        }
    ]
}

/**
 * Get the entry fields depending on the isCreate flag.
 */
export const getEntryFields = (isCreate: boolean) => {
    const fields: TField[] = []
    if (isCreate) {
        fields.push(FIdField)
    }

    fields.push(FTitleField)
    return fields
}
