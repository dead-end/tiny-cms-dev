<script lang="ts">
    import { onMount } from 'svelte'
    import type { TEntry } from '../ts/types'
    import { repoConfigStore } from '../ts/stores/repoConfig'
    import { push } from 'svelte-spa-router'
    import ButtonWrapper from '../components/ButtonWrapper.svelte'
    import { errorStore } from '../ts/stores/errorStore'
    import { getErrorMsg } from '../ts/libs/utils/utils'
    import { getCollectionListing } from '../ts/github/persistListings'
    import { getLastCommit } from '../ts/github/persistUtils'
    import { deleteItemFile } from '../ts/github/persistFiles'
    import FlexColWrapper from '../components/FlexColWrapper.svelte'
    import DeleteEntryPopup from '../components/popup/DeleteEntryPopup.svelte'

    export let params = {
        collection: ''
    }

    let deleteEntry: TEntry | null = null

    let entries: TEntry[] = []

    const doDelete = async (item: string) => {
        try {
            const lastCommit = await getLastCommit($repoConfigStore)
            // TODO: unused
            const newCommit = await deleteItemFile(
                $repoConfigStore,
                params.collection,
                item,
                lastCommit
            )

            entries = await getCollectionListing(
                $repoConfigStore,
                params.collection
            )
        } catch (e) {
            errorStore.set(getErrorMsg(e))
        }
    }

    onMount(async () => {
        try {
            entries = await getCollectionListing(
                $repoConfigStore,
                params.collection
            )
        } catch (e) {
            errorStore.set(getErrorMsg(e))
        }
    })
</script>

<h3 class="text-xl pb-6">
    Collection {params.collection}
</h3>
<FlexColWrapper>
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
                            on:click={() => (deleteEntry = item)}>Delete</button
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
</FlexColWrapper>

<DeleteEntryPopup {deleteEntry} {doDelete} />
