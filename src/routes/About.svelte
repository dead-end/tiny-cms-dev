<script lang="ts">
    import {
        ghGetFiles,
        ghGetListing,
        ghLastCommit,
        ghUpdateContent
    } from '../ts/github/github'
    import {} from '../ts/libs/result'
    import { repoConfigStore } from '../ts/stores/repoConfig'
    import type { TFile, TListing } from '../ts/types'

    let listing: TListing[] = []

    let file: TFile
    let files: TFile[]
    let commit: string

    const query = async () => {
        const result = await ghGetListing(
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
        const result = await ghGetFiles($repoConfigStore, [
            'collections/search-engine/bing.json',
            'collections/search-engine/google.json'
        ])

        if (result.hasError()) {
            console.log('ERROR', result.getError())
            return
        }

        files = result.getValue()
    }

    const getFile = async () => {
        const result = await ghGetFiles($repoConfigStore, [
            'collections/search-engine/bing.json'
        ])

        if (result.hasError()) {
            console.log('ERROR', result.getError())
            return
        }

        file = result.getValue()[0]
    }

    const getLastCommit = async () => {
        const result = await ghLastCommit($repoConfigStore)

        if (result.hasError()) {
            console.log('ERROR', result.getError())
            return
        }

        commit = result.getValue()
    }

    const update = async () => {
        if (commit) {
            ghUpdateContent($repoConfigStore, commit)
        }
    }
</script>

<div>
    <h1>About</h1>
    <button on:click={query} class="btn-base">Query</button>
    <button on:click={getFile} class="btn-base">Bing</button>
    <button on:click={getFiles} class="btn-base">Bings</button>
    <button on:click={getLastCommit} class="btn-base">last commit</button>
    <button on:click={update} class="btn-base">update</button>

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

    {#if commit}
        <h4>Commit:</h4>
        <p>{commit}</p>
    {/if}
</div>
