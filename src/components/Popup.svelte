<script lang="ts">
    import type { TButton } from '../ts/types'
    import ButtonWrapper from './ButtonWrapper.svelte'
    import PopupWrapper from './PopupWrapper.svelte'

    export let title: string
    export let desc: string
    export let buttons: TButton[]
    export let type: 'ok' | 'error' = 'ok'
</script>

<PopupWrapper>
    <div class="text-lg pb-2 border-b {type === 'error' ? 'text-red-900' : ''}">
        {title}
    </div>
    <div class="my-6">
        {desc}
    </div>
    <div>
        <ButtonWrapper>
            {#each buttons as button}
                <button class="btn-base" on:click={button.onclick}
                    >{button.label}</button
                >
            {/each}
        </ButtonWrapper>
    </div>
</PopupWrapper>
