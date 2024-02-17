<script lang="ts">
    import { onMount } from 'svelte'
    import { getItemFile, updateItemFile } from '../ts/github/persistance'
    import { repoConfigStore } from '../ts/stores/repoConfig'
    import type { TCommit, TItem } from '../ts/types'

    export let params = {
        collection: '',
        item: ''
    }

    let commitItem: TCommit<TItem>
    let error: string

    const load = async () => {
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
        commitItem = result.getValue()
        console.log('commitItem', commitItem)
    }

    const update = async () => {
        const result = await updateItemFile(
            $repoConfigStore,
            params.collection,
            params.item,
            commitItem.commit,
            commitItem.data
        )

        if (result.hasError()) {
            error = result.getError()
            return
        }

        commitItem = result.getValue()
    }

    onMount(load)
</script>

{#if error}
    <p class="bg-red-300">{error}</p>
{/if}

{#if commitItem}
    <h1 class="text-xl">{commitItem.data.title}</h1>
    <h1 class="text-sm">{commitItem.commit}</h1>
    <ul>
        <li>Id: {commitItem.data.id}</li>
        <li>Collection: {params.collection}</li>
        <li>Modified: {new Date(commitItem.data.modified).toLocaleString()}</li>
        <li>Title: {commitItem.data.title}</li>
    </ul>
    <p>{JSON.stringify(commitItem.data.data)}</p>

    <button on:click={load} class="btn-base">Refresh</button>
    <button on:click={update} class="btn-base">Update</button>
{/if}
