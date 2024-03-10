<script lang="ts">
    import type { TEntry } from '../../ts/types'
    import Popup from './Popup.svelte'

    export let deleteEntry: TEntry | null
    export let doDelete: (id: string) => Promise<void>
</script>

{#if deleteEntry}
    <Popup
        title="Delete Entry"
        desc="Do you want to delete entry: '{deleteEntry.tc_title}'"
        buttons={[
            {
                label: 'Close',
                onclick: () => {
                    deleteEntry = null
                }
            },
            {
                label: 'Delete',
                onclick: async () => {
                    if (deleteEntry) {
                        await doDelete(deleteEntry.tc_id)
                        deleteEntry = null
                    }
                }
            }
        ]}
    />
{/if}
