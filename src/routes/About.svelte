<script lang="ts">
    import { ghLastCommit, ghUpdateContent } from '../ts/github/github'
    import {} from '../ts/libs/result'
    import { repoConfigStore } from '../ts/stores/repoConfig'

    let commit: string

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
    <button on:click={getLastCommit} class="btn-base">last commit</button>
    <button on:click={update} class="btn-base">update</button>

    <div class="bg-slate-200">
        <h1>Main</h1>
        <p>owner: {$repoConfigStore.owner}</p>
        <p>Name: {$repoConfigStore.name}</p>
        <p>Token: {$repoConfigStore.token}</p>
    </div>

    {#if commit}
        <h4>Commit:</h4>
        <p>{commit}</p>
    {/if}
</div>
