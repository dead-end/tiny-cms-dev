<script lang="ts">
    export let error: string
</script>

{#if error}
    <p class="text-xs text-red-600 pt-2">{error}</p>
{/if}
