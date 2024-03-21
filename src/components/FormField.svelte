<script lang="ts">
    import { componentRegistry } from '../ts/components'
    import { defaultString } from '../ts/libs/utils/utils'
    import type { TData, TField } from '../ts/types/entries'

    export let field: TField
    export let data: TData
    export let formErrors: Map<string, string>
    export let disabled: boolean

    const component = componentRegistry[field.component]
    const props = component.hasProps ? { props: field.props } : {}
</script>

<svelte:component
    this={component.component}
    id={field.id}
    label={field.label}
    value={defaultString(data[field.id])}
    {...props}
    error={formErrors.get(field.id)}
    {disabled}
/>
