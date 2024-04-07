<script lang="ts">
    import type { TValidatorDefinition } from '../ts/types/validators'

    export let validator: TValidatorDefinition
</script>

<table class="bg-white shadow w-full">
    <tr class="tb-head-secondary">
        <th class="tb-cell w-1/3">Validator</th>
        <th class="tb-cell">{validator.validator}</th>
    </tr>
    {#if validator.message}
        <tr class="tb-row">
            <td class="tb-cell">Error message</td>
            <td class="tb-cell">{validator.message}</td>
        </tr>
    {/if}
    {#if validator.props}
        {#each Object.keys(validator.props) as key}
            <tr class="tb-row">
                <td class="tb-cell">{key}</td>
                <td class="tb-cell">{validator.props[key]}</td>
            </tr>
        {/each}
    {/if}
</table>
