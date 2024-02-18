<script lang="ts">
    import { errorStore } from '../ts/stores/errorStore'
    import PopupWrapper from './PopupWrapper.svelte'

    const onOk = () => {
        errorStore.set('')
    }
</script>

{#if $errorStore !== ''}
    <PopupWrapper>
        <div class="text-lg pb-2 border-b text-red-900">Errors</div>
        <div class="my-6">
            {$errorStore}
        </div>
        <div>
            <button class="btn-base" on:click={onOk}>Ok</button>
        </div>
    </PopupWrapper>
{/if}
