<script lang="ts">
    import type { TButton } from '../../ts/types/misc'
    import ButtonWrapper from '../wrappers/ButtonWrapper.svelte'

    export let title: string
    export let desc: string
    export let buttons: TButton[]
    export let type: 'ok' | 'error' = 'ok'
</script>

<div
    class="fixed z-50 inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full"
>
    <div
        class="relative top-1/3 mx-auto max-w-md bg-white rounded-md shadow-xl p-6"
    >
        <div
            class="text-lg pb-2 border-b {type === 'error'
                ? 'text-red-900'
                : ''}"
        >
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
    </div>
</div>
