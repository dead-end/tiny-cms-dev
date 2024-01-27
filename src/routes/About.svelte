<script lang="ts">
    import { gqlGetFile, gqlGetListing, type TListing } from '../ts/graphql'
    import { repoConfigStore } from '../ts/stores/repoConfig'

    let listing: TListing[] = []

    const query = async () => {
        listing = await gqlGetListing(
            $repoConfigStore,
            'collections/search-engine'
        )
    }

    const getFile = async () => {
        await gqlGetFile(
            $repoConfigStore,
            'collections/search-engine/bing.json'
        )
    }
</script>

<div>
    <h1>About</h1>
    <button on:click={query} class="btn-base">Query</button>
    <button on:click={getFile} class="btn-base">Bing</button>

    {#if listing}
        <ul>
            {#each listing as entry}
                <li>
                    <div class="w-10 bg-red-200 inline-block">
                        {entry.type === 'blob' ? 'File' : 'Dir'}
                    </div>
                    {entry.name}
                </li>
            {/each}
        </ul>
    {/if}

    <div class="bg-slate-200">
        <h1>Main</h1>
        <p>owner: {$repoConfigStore.owner}</p>
        <p>Name: {$repoConfigStore.name}</p>
        <p>Token: {$repoConfigStore.token}</p>
    </div>
</div>
