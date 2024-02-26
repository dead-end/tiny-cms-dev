<script lang="ts">
    import { onMount } from 'svelte'
    import type { TEntry } from '../ts/types'
    import {
        deleteItemFile,
        getCollectionListing,
        getLastCommit
    } from '../ts/github/persistance'
    import { repoConfigStore } from '../ts/stores/repoConfig'
    import { push } from 'svelte-spa-router'
    import ButtonWrapper from '../components/ButtonWrapper.svelte'
    import { errorStore } from '../ts/stores/errorStore'

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

    const deleteItem = async (item: string) => {
        const resultCommit = await getLastCommit($repoConfigStore)

        if (resultCommit.hasError()) {
            errorStore.set(resultCommit.getError())
            return
        }

        const resultDelete = await deleteItemFile(
            $repoConfigStore,
            params.collection,
            item,
            resultCommit.getValue()
        )

        if (resultDelete.hasError()) {
            errorStore.set(resultDelete.getError())
            return
        }

        loadCollection(params.collection)
    }

    onMount(async () => {
        loadCollection(params.collection)
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
            <td class="tb-cell">{item.tc_id}</td>
            <td class="tb-cell">{item.tc_title}</td>
            <td class="tb-cell"
                >{new Date(item.tc_modified).toLocaleDateString()}</td
            >
            <td class="tb-cell">
                <ButtonWrapper>
                    <button
                        class="btn-base"
                        on:click={() =>
                            push(
                                `#/collection/${params.collection}/item/${item.tc_id}`
                            )}>Show</button
                    >
                    <button
                        class="btn-base"
                        on:click={() => deleteItem(item.tc_id)}>Delete</button
                    >
                </ButtonWrapper>
            </td>
        </tr>
    {/each}
</table>
<ButtonWrapper>
    <button
        class="btn-base"
        on:click={() => push(`#/collection/${params.collection}/create`)}
        >Create</button
    >
</ButtonWrapper>
