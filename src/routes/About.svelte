<script lang="ts">
  import { count } from "../ts/stores/count";
</script>

<h1>About</h1>
<p>Count: {$count}</p>
<button on:click={count.increment}>Add</button>
