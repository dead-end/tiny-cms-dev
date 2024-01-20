<script lang="ts">
    import { repoConfigStore } from '../ts/stores/repoConfig'
    import Login from './Login.svelte'
    import RepoConfigSetup from './RepoConfigSetup.svelte'
    import { onMount } from 'svelte'

    onMount(() => {
        repoConfigStore.initRepoConfig()
    })
</script>

<div class="bg-slate-200">
    <h1>Main</h1>
    <p>owner: {$repoConfigStore.owner}</p>
    <p>Name: {$repoConfigStore.name}</p>
    <p>Token: {$repoConfigStore.token}</p>
</div>
{#if !$repoConfigStore.name}
    <RepoConfigSetup />
{:else if !$repoConfigStore.token}
    <Login />
{:else}
    <slot />
{/if}
