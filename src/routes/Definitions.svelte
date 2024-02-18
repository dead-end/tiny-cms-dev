<script lang="ts">
    import { onMount } from 'svelte'
    import type { TEntry } from '../ts/types'
    import { getDefinitionsListing } from '../ts/github/persistance'
    import { repoConfigStore } from '../ts/stores/repoConfig'
    import { push } from 'svelte-spa-router'
    import { errorStore } from '../ts/stores/errorStore'

    let entries: TEntry[] = []

    const load = async () => {
        const result = await getDefinitionsListing($repoConfigStore)
        if (result.hasError()) {
            errorStore.addError(result.getError())
            return
        }

        entries = result.getValue()
    }

    onMount(async () => {
        load()
    })
</script>

<h3 class="text-xl pb-6">Definitions</h3>
<table class="bg-white shadow w-full">
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
                    on:click={() => push('#/collections/' + item.id)}
                    >Show</button
                ></td
            >
        </tr>
    {/each}
</table>
