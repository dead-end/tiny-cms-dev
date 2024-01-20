<script lang="ts">
    import { repoConfigStore } from '../ts/stores/repoConfig'
    import Login from './Login.svelte'
    import RepoConfigSetup from './RepoConfigSetup.svelte'
    import { onMount } from 'svelte'

    onMount(() => {
        repoConfigStore.initRepoConfig()
    })
</script>

{#if !$repoConfigStore.name}
    <div class="flex h-screen">
        <div class="m-auto px-16 py-20 bg-gray-50">
            <h1 class="text-2xl font-bold mb-6">Tiny CMS</h1>
            <RepoConfigSetup />
        </div>
    </div>
{:else if !$repoConfigStore.token}
    <div class="flex h-screen">
        <div class="m-auto px-16 py-20 bg-gray-50">
            <h1 class="text-2xl font-bold mb-6">Tiny CMS</h1>
            <Login />
        </div>
    </div>
{:else}
    <slot />
{/if}
