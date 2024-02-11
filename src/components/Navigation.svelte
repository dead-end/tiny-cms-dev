<script lang="ts">
    import { repoConfigStore } from '../ts/stores/repoConfig'
    import type { TNavEntry } from '../ts/types'

    export let entries: TNavEntry[] = []
</script>

<nav class="col-span-1 text-end bg-gray-50">
    <h1 class="text-2xl font-bold bg-blue-600 text-white py-6 pr-4">
        Tiny CMS
    </h1>
    <ul class="flex flex-col items-end">
        {#each entries as entry}
            <li
                class="py-4 px-4 border-b w-full hover:bg-gray-100 hover:text-gray-900 active:bg-gray-100 transition duration-200 ease-in-out"
            >
                <a href={entry.path}>{entry.label}</a>
            </li>
        {/each}
        <li
            class="py-4 px-4 border-b w-full hover:bg-gray-100 hover:text-gray-900 active:bg-gray-100 transition duration-200 ease-in-out"
        >
            <a href="#/" on:click={repoConfigStore.logout}>Logout</a>
        </li>
    </ul>
</nav>
