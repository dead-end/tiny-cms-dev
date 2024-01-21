<script lang="ts">
    export let id: string
    export let label: string
    export let error: string
</script>

<div>
    <label for={id} class="label-base mb-2">{label}</label>
    <slot />
    {#if error}
        <p class="text-xs text-red-600 pt-2">{error}</p>
    {/if}
</div>
