import type { TField } from '../types'

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
