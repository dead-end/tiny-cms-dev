<script lang="ts">
    import { componentRegistry } from '../ts/components'
    import { defaultString } from '../ts/libs/utils'
    import type { TField } from '../ts/types'

    export let fields: TField[]
    export let data: Record<string, any>
    export let formErrors: Map<string, string>
    export let disabled: boolean
</script>

{#each fields as field}
    {#if field.type}
        <svelte:component
            this={componentRegistry[field.component]}
            id={field.id}
            label={field.label}
            value={defaultString(data[field.id])}
            error={formErrors.get(field.id)}
            type={field.type}
            {disabled}
            {...field.props}
        />
    {:else}
        <svelte:component
            this={componentRegistry[field.component]}
            id={field.id}
            label={field.label}
            value={defaultString(data[field.id])}
            error={formErrors.get(field.id)}
            {disabled}
            {...field.props}
        />
    {/if}
{/each}
