<script lang="ts">
    import type { TField } from '../ts/types'
    import InputField from './InputField.svelte'

    export let fields: TField[]
    export let data: Record<string, any>
    export let formErrors: Map<string, string>
    export let disabled: boolean
</script>

{#each fields as field}
    <InputField {field} {data} {formErrors} {disabled} />
{/each}
