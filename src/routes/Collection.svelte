<script lang="ts">
    import { onMount } from 'svelte'
    import type { TEntry } from '../ts/types'
    import { getCollectionListing } from '../ts/github/persistance'
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

<h3>Collection {params.collection}</h3>

{#if error}
    <p class="bg-red-300">{error}</p>
{/if}

<table class="bg-white">
    <tr>
        <th class="p-3">ID</th>
        <th class="p-3">Title</th>
        <th class="p-3">Modified</th>
        <th class="p-3"></th>
    </tr>
    {#each entries as item}
        <tr>
            <td class="p-3">{item.id}</td>
            <td class="p-3">{item.title}</td>
            <td class="p-3">{new Date(item.modified).toLocaleDateString()}</td>
            <td class="p-3"
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