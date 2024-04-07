<script lang="ts">
    import type { TField } from '../ts/types/entries'
    import Validator from './Validator.svelte'
    import CardWrapper from './wrappers/CardWrapper.svelte'
    import FlexColWrapper from './wrappers/FlexColWrapper.svelte'

    export let field: TField
</script>

<CardWrapper label="Field">
    <FlexColWrapper>
        <table class="bg-white shadow w-full">
            <tr class="tb-head">
                <th class="tb-cell w-1/3">Field</th>
                <th class="tb-cell">{field.label}</th>
            </tr>
            <tr class="tb-row">
                <td class="tb-cell">Id</td>
                <td class="tb-cell">{field.id}</td>
            </tr>
            <tr class="tb-row">
                <td class="tb-cell">Component</td>
                <td class="tb-cell">{field.component}</td>
            </tr>
            {#if field.value}
                <tr class="tb-row">
                    <td class="tb-cell">Default value</td>
                    <td class="tb-cell">{field.value}</td>
                </tr>
            {/if}

            {#if field.props}
                {#each Object.keys(field.props) as key}
                    <tr class="tb-row">
                        <td class="tb-cell">{key}</td>
                        <td class="tb-cell">{field.props[key]}</td>
                    </tr>
                {/each}
            {/if}
        </table>

        {#if field.validators}
            {#each field.validators as validator}
                <Validator {validator} />
            {/each}
        {/if}
    </FlexColWrapper>
</CardWrapper>
