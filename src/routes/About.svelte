<script lang="ts">
    import { repoConfigStore } from '../ts/stores/repoConfig'

    let commit: string
</script>

<div>
    <h1>About</h1>

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
