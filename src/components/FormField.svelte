<script lang="ts">
    import { componentRegistry } from '../ts/components'
    import { defaultString } from '../ts/libs/utils/utils'
    import type { TData, TField } from '../ts/types'

    export let field: TField
    export let data: TData
    export let formErrors: Map<string, string>
    export let disabled: boolean
</script>

<svelte:component
    this={componentRegistry[field.component].component}
    id={field.id}
    label={field.label}
    value={defaultString(data[field.id])}
    error={formErrors.get(field.id)}
    {disabled}
/>
