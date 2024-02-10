<script lang="ts">
    import { onMount } from 'svelte'
    import type { TItem } from '../ts/types'
    import { colGetCollection } from '../ts/github/collections'
    import { repoConfigStore } from '../ts/stores/repoConfig'

    export let params = {
        collection: ''
    }

    let items: TItem[] = []

    let error = ''

    const loadCollection = async (collection: string) => {
        const result = await colGetCollection($repoConfigStore, collection)
        if (result.hasError()) {
            error = result.getError()
            return
        }

        error = ''
        items = result.getValue()
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
    {#each items as item}
        <tr>
            <td class="p-3">{item.id}</td>
            <td class="p-3">{item.title}</td>
            <td class="p-3">{new Date(item.modified).toLocaleDateString()}</td>
            <td class="p-3"><button>Show</button></td>
        </tr>
    {/each}
</table>
