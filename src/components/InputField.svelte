<script lang="ts">
    import { componentRegistry } from '../ts/components'
    import { defaultString } from '../ts/libs/utils'
    import type { TField } from '../ts/types'

    export let field: TField
    export let data: Record<string, any>
    export let formErrors: Map<string, string>
    export let disableFct: (id: string) => boolean

    let type = field.type ? { type: field.type } : {}
</script>

<svelte:component
    this={componentRegistry[field.component]}
    id={field.id}
    label={field.label}
    value={defaultString(data[field.id])}
    error={formErrors.get(field.id)}
    {...type}
    disabled={disableFct(field.id)}
    {...field.props}
/>
