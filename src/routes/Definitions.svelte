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

    let entries: TEntry[] = []

    const load = async () => {
        try {
            entries = await getDefinitionsListing($repoConfigStore)
        } catch (e) {
            errorStore.set(getErrorMsg(e))
        }
    }

    onMount(async () => {
        load()
    })
</script>

<CardWrapper label="Definitions">
    <table class="bg-white shadow w-full">
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
                            on:click={() => push('#/collection/' + item.tc_id)}
                            >Show</button
                        ></ButtonWrapper
                    >
                </td>
            </tr>
        {/each}
    </table>
</CardWrapper>
