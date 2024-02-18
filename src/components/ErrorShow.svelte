<script lang="ts">
    import { errorStore } from '../ts/stores/errorStore'
    import PopupWrapper from './PopupWrapper.svelte'

    const onOk = () => {
        errorStore.resetErrors()
    }
</script>

{#if $errorStore.length !== 0}
    <PopupWrapper>
        <div class="text-lg pb-2 my-6 border-b text-red-900">Errors</div>
        <ul>
            {#each $errorStore as error}
                <li>{error}</li>
            {/each}
        </ul>
        <div class="pt-4">
            <button class="btn-base" on:click={onOk}>Ok</button>
        </div>
    </PopupWrapper>
{/if}
