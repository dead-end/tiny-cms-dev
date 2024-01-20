<script lang="ts">
    import { repoConfigStore } from '../ts/stores/repoConfig'
</script>

<div class="bg-green-300">
    <h1>Home</h1>
    <button class="btn-base" on:click={repoConfigStore.logout}>Logout</button>
</div>
