<script lang="ts">
    import { onMount } from 'svelte'
    import type { TEntry } from '../ts/types/entries'
    import { repoConfigStore } from '../ts/stores/repoConfig'
    import { push } from 'svelte-spa-router'
    import { errorStore } from '../ts/stores/errorStore'
    import CardWrapper from '../components/wrappers/CardWrapper.svelte'
    import { getErrorMsg } from '../ts/libs/utils/utils'
    import {
        getCollectionListing,
        getDefinitionsListing
    } from '../ts/github/persistListings'
    import ButtonWrapper from '../components/wrappers/ButtonWrapper.svelte'
    import FlexColWrapper from '../components/wrappers/FlexColWrapper.svelte'
    import DeleteEntryPopup from '../components/popup/DeleteEntryPopup.svelte'
    import { getLastCommit } from '../ts/github/persistUtils'
    import { deleteDefinitionFile } from '../ts/github/persistFiles'
    import ShowIcon from '../components/icons/ShowIcon.svelte'
    import DeleteIcon from '../components/icons/DeleteIcon.svelte'
    import ListIcon from '../components/icons/ListIcon.svelte'

    let entries: TEntry[] = []

    let deleteEntry: TEntry | null = null

    const doDelete = async (id: string) => {
        try {
            const lastCommit = await getLastCommit($repoConfigStore)

            //
            // Ensure that the collection is empty before we delete the
            // definition.
            //
            const listing = await getCollectionListing($repoConfigStore, id)
            if (listing.length !== 0) {
                const list = listing
                    .map((entry) => `'${entry.tc_title}'`)
                    .join(' ,')
                errorStore.set(`There are items in the collection: ${list}`)
                return
            }

            // TODO: unused
            const newCommit = await deleteDefinitionFile(
                $repoConfigStore,
                id,
                lastCommit
            )

            entries = await getDefinitionsListing($repoConfigStore)
        } catch (e) {
            errorStore.set(getErrorMsg(e))
        }
    }

    onMount(async () => {
        try {
            entries = await getDefinitionsListing($repoConfigStore)
        } catch (e) {
            errorStore.set(getErrorMsg(e))
        }
    })
</script>

<CardWrapper label="Definitions">
    <FlexColWrapper>
        <table class="bg-white shadow w-full">
            <tr class="tb-head">
                <th class="tb-cell">ID</th>
                <th class="tb-cell">Title</th>
                <th class="tb-cell">Modified</th>
                <th class="tb-cell"></th>
            </tr>
            {#each entries as definition}
                <tr class="tb-row">
                    <td class="tb-cell">{definition.tc_id}</td>
                    <td class="tb-cell">{definition.tc_title}</td>
                    <td class="tb-cell"
                        >{new Date(
                            definition.tc_modified
                        ).toLocaleDateString()}</td
                    >
                    <td class="tb-cell">
                        <ButtonWrapper>
                            <ShowIcon
                                onClick={() =>
                                    push(
                                        '#/definitions/definition/' +
                                            definition.tc_id
                                    )}
                            />
                            <DeleteIcon
                                onClick={() => (deleteEntry = definition)}
                            />
                            <ListIcon
                                onClick={() =>
                                    push('#/collection/' + definition.tc_id)}
                            />
                        </ButtonWrapper>
                    </td>
                </tr>
            {/each}
        </table>
        <ButtonWrapper>
            <button
                class="btn-base"
                on:click={() => push(`#/definitions/create`)}>Create</button
            >
        </ButtonWrapper>
    </FlexColWrapper>
</CardWrapper>

<DeleteEntryPopup {deleteEntry} {doDelete} />
