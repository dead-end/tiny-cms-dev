import AreaInput from '../components/input/AreaInput.svelte'
import TextInput from '../components/input/TextInput.svelte'

/**
 * Registry for the validators.
 */
export const componentRegistry: Record<string, any> = {
    text: TextInput,
    area: AreaInput
}
