import AreaInput from '../components/input/AreaInput.svelte'
import PasswordInput from '../components/input/PasswordInput.svelte'
import TextInput from '../components/input/TextInput.svelte'
import type { TComponent } from './types'

/**
 * Registry for the input field with the component and the allowed validators.
 */
// TODO: validators are currently not used.
export const componentRegistry: Record<string, TComponent> = {
    text: {
        component: TextInput,
        validators: ['required', 'min', 'max', 'regex']
    },
    password: {
        component: PasswordInput,
        validators: ['required', 'min', 'max', 'regex']
    },
    area: {
        component: AreaInput,
        validators: ['required', 'min', 'max', 'regex']
    }
}
