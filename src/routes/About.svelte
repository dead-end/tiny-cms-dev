<script lang="ts">
    import { gqlTest, type TListing } from '../ts/graphql'
    import { count } from '../ts/stores/count'
    import { repoConfigStore } from '../ts/stores/repoConfig'

    let listing: TListing[] = []

    const query = async () => {
        listing = await gqlTest($repoConfigStore, '/')
    }
</script>

<div class="bg-green-300">
    <h1>About</h1>
    <p>Count: {$count}</p>
    <button on:click={count.increment}>Add</button>
    <button on:click={query} class="btn-base">Query</button>

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
</div>
