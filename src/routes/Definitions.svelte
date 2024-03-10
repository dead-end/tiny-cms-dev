<script lang="ts">
    import { onMount } from 'svelte'
    import type { TEntry } from '../ts/types'
    import { repoConfigStore } from '../ts/stores/repoConfig'
    import { push } from 'svelte-spa-router'
    import { errorStore } from '../ts/stores/errorStore'
    import CardWrapper from '../components/CardWrapper.svelte'
    import { getErrorMsg } from '../ts/libs/utils/utils'
    import { getDefinitionsListing } from '../ts/github/persistListings'
    import ButtonWrapper from '../components/ButtonWrapper.svelte'
    import FlexColWrapper from '../components/FlexColWrapper.svelte'
    import Popup from '../components/Popup.svelte'
    import { getLastCommit } from '../ts/github/persistUtils'
    import { deleteDefinitionFile } from '../ts/github/persistFiles'

    let entries: TEntry[] = []

    let deleteEntry: TEntry | null = null

    const doDelete = async (id: string) => {
        try {
            const lastCommit = await getLastCommit($repoConfigStore)
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
                            <button
                                class="btn-base"
                                on:click={() =>
                                    push(
                                        '#/definitions/definition/' +
                                            definition.tc_id
                                    )}>Show</button
                            >
                            <button
                                class="btn-base"
                                on:click={() => (deleteEntry = definition)}
                                >Delete</button
                            >
                            <button
                                class="btn-base"
                                on:click={() =>
                                    push('#/collection/' + definition.tc_id)}
                                >Collection</button
                            >
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

{#if deleteEntry}
    <Popup
        title="Delete Definition"
        desc="Do you want to delete definition: '{deleteEntry.tc_title}'"
        buttons={[
            {
                label: 'Close',
                onclick: () => {
                    deleteEntry = null
                }
            },
            {
                label: 'Delete',
                onclick: async () => {
                    if (deleteEntry) {
                        await doDelete(deleteEntry.tc_id)
                        deleteEntry = null
                    }
                }
            }
        ]}
    />
{/if}
