<script lang="ts">
  import { replace, location } from "svelte-spa-router";
  import { repoConfigStore } from "../ts/stores/repoConfig";
  import Login from "./Login.svelte";
</script>

<div class="bg-slate-200">
  <h1>Main</h1>
  <p>Token: {$repoConfigStore.token}</p>
  <p>Is logged in: {repoConfigStore.isLogin()}</p>
</div>
{#if $repoConfigStore.token}
  <slot />
{:else}
  <Login />
{/if}
