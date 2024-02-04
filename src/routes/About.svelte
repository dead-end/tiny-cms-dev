<script lang="ts">
    import {
        gqlGetFile,
        gqlGetFiles,
        gqlGetListing,
        type TFile,
        type TListing
    } from '../ts/graphql'
    import {} from '../ts/libs/result'
    import { repoConfigStore } from '../ts/stores/repoConfig'

    let listing: TListing[] = []

    let file: TFile
    let files: TFile[]

    const query = async () => {
        const result = await gqlGetListing(
            $repoConfigStore,
            'collections/search-engine'
        )

        if (result.hasError()) {
            console.log('ERROR', result.getError())
            return
        }

        listing = result.getValue()
    }

    const getFiles = async () => {
        const result = await gqlGetFiles(
            $repoConfigStore,
            ['collections/search-engine/bing.json',
            'collections/search-engine/google.json']
        )

        if (result.hasError()) {
            console.log('ERROR', result.getError())
            return
        }

        files = result.getValue()
    }

    const getFile = async () => {
        const result = await gqlGetFile(
            $repoConfigStore,
            'collections/search-engine/bing.json'
        )

        if (result.hasError()) {
            console.log('ERROR', result.getError())
            return
        }

        file = result.getValue()
    }
</script>

<div>
    <h1>About</h1>
    <button on:click={query} class="btn-base">Query</button>
    <button on:click={getFile} class="btn-base">Bing</button>
    <button on:click={getFiles} class="btn-base">Bings</button>

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

    {#if file}
        <h4>{file.oid}</h4>
        <p>{file.text}</p>
    {/if}

    {#if files}
        {#each files as f}
            <h4>{f.oid}</h4>
            <p>{f.text}</p>
        {/each}
    {/if}
</div>
