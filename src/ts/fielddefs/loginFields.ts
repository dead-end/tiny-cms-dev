import type { TField } from '../types/entries'

/**
 * Definition of the fields for the login dialog.
 */
export const FLoginFields: TField[] = [
    {
        id: 'password',
        component: 'password',
        label: 'Password',
        validators: [
            {
                validator: 'required'
            }
        ]
    }
]
