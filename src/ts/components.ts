import AreaInput from '../components/input/AreaInput.svelte'
import PasswordInput from '../components/input/PasswordInput.svelte'
import TextInput from '../components/input/TextInput.svelte'

/**
 * Registry for the validators.
 */
export const componentRegistry: Record<string, any> = {
    text: TextInput,
    password: PasswordInput,
    area: AreaInput
}
