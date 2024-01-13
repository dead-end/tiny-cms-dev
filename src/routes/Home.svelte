<script lang="ts">
  import { count } from "../ts/stores/count";
  import { repoConfigStore } from "../ts/stores/repoConfig";
</script>

<div class="bg-green-300">
  <h1>Home</h1>
  <p>Count: {$count}</p>
  <button class="btn-base" on:click={count.increment}>Add</button>
  <button class="btn-base" on:click={repoConfigStore.logout}>Logout</button>
</div>
