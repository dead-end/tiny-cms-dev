<script lang="ts">
    export let label: string
</script>

<div class="bg-white p-6 rounded-md shadow">
    <h3 class="text-lg pb-2 my-6 border-b">{label}</h3>
    <slot />
</div>
