import type { TField } from '../types'

/**
 * Definition of the fields for the repo config dialog.
 */
export const FRepoConfigFields: TField[] = [
    {
        id: 'owner',
        label: 'Repository Owner',
        component: 'text',
        value: '',
        validators: [
            {
                validator: 'required'
            }
        ]
    },
    {
        id: 'name',
        label: 'Repository Name',
        component: 'text',
        value: '',
        validators: [
            {
                validator: 'required'
            }
        ]
    },
    {
        id: 'branch',
        label: 'Branch',
        component: 'text',
        value: 'main',
        validators: [
            {
                validator: 'required'
            }
        ]
    },
    {
        id: 'prefix',
        label: 'Prefix',
        component: 'text',
        value: '',
        validators: []
    },
    {
        id: 'token',
        label: 'Token',
        component: 'password',
        value: '',
        validators: [
            {
                validator: 'required'
            }
        ]
    },
    {
        id: 'password',
        label: 'Password',
        component: 'password',
        value: '',
        validators: [
            {
                validator: 'required'
            },
            {
                validator: 'min',
                props: {
                    min: 5
                }
            },
            {
                validator: 'max',
                props: {
                    max: 15
                }
            }
        ]
    },
    {
        id: 'confirm',
        label: 'Confirm',
        component: 'password',
        value: '',
        validators: [
            {
                validator: 'required'
            },
            {
                validator: 'fieldEquals',
                props: {
                    field: 'password',
                    msg: 'Password do not match!'
                }
            }
        ]
    }
]
