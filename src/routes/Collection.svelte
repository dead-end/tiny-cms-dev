<script lang="ts">
    import { onMount } from 'svelte'
    import type { TEntry } from '../ts/types'
    import { getCollectionListing } from '../ts/github/collections'
    import { repoConfigStore } from '../ts/stores/repoConfig'
    import { push } from 'svelte-spa-router'

    export let params = {
        collection: ''
    }

    let entries: TEntry[] = []

    let error = ''

    const loadCollection = async (collection: string) => {
        const result = await getCollectionListing($repoConfigStore, collection)
        if (result.hasError()) {
            error = result.getError()
            return
        }

        error = ''
        entries = result.getValue()
    }

    onMount(async () => {
        loadCollection('search-engine')
    })
</script>

{#if error}
    <p class="bg-red-300">{error}</p>
{/if}

<h3 class="text-xl pb-6">
    Collection {params.collection}
</h3>
<table class="shadow w-full">
    <tr class="tb-head">
        <th class="tb-cell">ID</th>
        <th class="tb-cell">Title</th>
        <th class="tb-cell">Modified</th>
        <th class="tb-cell"></th>
    </tr>
    {#each entries as item}
        <tr class="tb-row">
            <td class="tb-cell">{item.id}</td>
            <td class="tb-cell">{item.title}</td>
            <td class="tb-cell"
                >{new Date(item.modified).toLocaleDateString()}</td
            >
            <td class="tb-cell"
                ><button
                    class="btn-base"
                    on:click={() =>
                        push(`#/collections/${params.collection}/${item.id}`)}
                    >Show</button
                ></td
            >
        </tr>
    {/each}
</table>
