<script lang="ts">
    import type { TField } from '../ts/types'

    export let field: TField
</script>

<div>
    <h4>Field: {field.label} - ({field.id})</h4>
    {#if field.value}
        <p>Default value: {field.value}</p>
    {/if}

    {#if field.validators}
        <ul>
            {#each field.validators as validator}
                <h4>Validator: {validator.validator}</h4>
                {#if validator.props}
                    {#each Object.keys(validator.props) as key}
                        <p class="text-sm">
                            Key: {key} value: {validator.props[key]}
                        </p>
                    {/each}
                {/if}
            {/each}
        </ul>
    {/if}
</div>
