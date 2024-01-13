<script lang="ts">
  export let submit: (e: Event) => void;
  export let label: string;
</script>

<form class="bg-white p-6 rounded-sm shadow" on:submit|preventDefault={submit}>
  <h3 class="text-lg pb-2 my-6 border-b">{label}</h3>

  <slot />

  <button class="btn-base my-4" type="submit">Submit</button>
</form>
