<script lang="ts">
    import type { TEntry } from '../ts/types/entries'

    export let entry: TEntry
    export let commit: string
    export let show: boolean
</script>

{#if show && entry}
    <div class="text-sm text-right text-gray-500 pb-4">
        <div>
            Modifield: {new Date(entry.tc_modified).toLocaleString()}
        </div>
        <div>
            Commit: {commit.substring(0, 7)}
        </div>
    </div>

    <h3 class="pb-4">ID: {entry.tc_id}</h3>
{/if}
