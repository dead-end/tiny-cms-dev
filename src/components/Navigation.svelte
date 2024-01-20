<script lang="ts">
    import { repoConfigStore } from '../ts/stores/repoConfig'
    import type { TNavEntry } from '../ts/types'

    export let entries: TNavEntry[] = []
</script>

<ul class="flex flex-col items-end py-4">
    {#each entries as entry}
        <li class="py-2">
            <a class="hover:underline hover:text-gray-900" href={entry.path}
                >{entry.label}</a
            >
        </li>
    {/each}
    <li class="py-2">
        <a
            class="hover:underline hover:text-gray-900"
            href="#/"
            on:click={repoConfigStore.logout}>Logout</a
        >
    </li>
</ul>
