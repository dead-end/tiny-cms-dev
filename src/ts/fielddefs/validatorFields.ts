import type { TField } from '../types/entries'

/**
 * The definition of the validator fields.
 */
// TODO: currently not used
export const FValidators: TField[] = [
    {
        id: 'required',
        component: 'checkbox',
        label: 'Required',
        validators: []
    },
    {
        id: 'min',
        component: 'text',
        label: 'Min',
        validators: [
            {
                validator: 'required'
            },
            {
                validator: 'regex',
                props: {
                    regex: '^[0-9]*$'
                }
            }
        ]
    },
    {
        id: 'max',
        component: 'text',
        label: 'Max',
        validators: [
            {
                validator: 'required'
            },
            {
                validator: 'regex',
                props: {
                    regex: '^[0-9]*$'
                }
            }
        ]
    },
    {
        id: 'regex',
        component: 'text',
        label: 'Regex',
        validators: [
            {
                validator: 'required'
            },
            {
                validator: 'regex',
                props: {
                    regex: '^[0-9]*$'
                }
            }
        ]
    }
]
