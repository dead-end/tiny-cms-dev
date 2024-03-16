<script lang="ts">
    import type { TData, TField } from '../ts/types'
    import FormField from './FormField.svelte'

    export let fields: TField[]
    export let data: TData
    export let formErrors: Map<string, string>
    export let disabled: boolean
</script>

{#each fields as field}
    <FormField {field} {data} {formErrors} {disabled} />
{/each}
