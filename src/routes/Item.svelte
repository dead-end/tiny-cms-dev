<script lang="ts">
    import { onMount } from 'svelte'
    import { getItemFile } from '../ts/github/persistance'
    import { repoConfigStore } from '../ts/stores/repoConfig'
    import type { TItem } from '../ts/types'

    export let params = {
        collection: '',
        item: ''
    }

    let item: TItem
    let error: string

    onMount(async () => {
        const result = await getItemFile(
            $repoConfigStore,
            params.collection,
            params.item
        )

        if (result.hasError()) {
            error = result.getError()
            return
        }
        error = ''
        item = result.getValue()
    })
</script>

{#if error}
    <p class="bg-red-300">{error}</p>
{/if}

{#if item}
    <h1 class="text-xl">{item.title}</h1>
    <ul>
        <li>Id: {item.id}</li>
        <li>Collection: {params.collection}</li>
        <li>Modified: {new Date(item.modified).toLocaleString()}</li>
        <li>Title: {item.title}</li>
    </ul>
    <p>{JSON.stringify(item.data)}</p>
{/if}
