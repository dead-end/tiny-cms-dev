<script lang="ts">
    import Popup from '../popup/Popup.svelte'
    import InputLabel from '../base/InputLabel.svelte'
    import InputError from '../base/InputError.svelte'
    import { mdToHtml } from '../../ts/libs/utils/markdown'

    export let id: string
    export let label: string
    export let value: string
    export let error: string | undefined
    export let disabled = false

    const chkId = id + '-chk'

    let showHtml = false

    const buttons = [
        {
            label: 'OK',
            onclick: () => {
                showHtml = false
            }
        }
    ]

    const onblur = () => {
        if (error) {
            error = ''
        }
    }
</script>

<div>
    <div class="flex flex-row justify-between">
        <InputLabel {id} {label} />
        <div class="flex flex-row gap-2">
            <InputLabel id={chkId} label="HTML" />
            <input
                id={chkId}
                class="checkbox-base"
                type="checkbox"
                bind:checked={showHtml}
            />
        </div>
    </div>

    {#if showHtml}
        <Popup title="Html from Markdown" {buttons} type="ok">
            <div class="prose">
                {@html mdToHtml(value)}
            </div>
        </Popup>
    {/if}

    <textarea
        {id}
        name={id}
        class="input-base"
        on:blur={onblur}
        {disabled}
        bind:value
        rows="8"
    />

    <InputError {error} />
</div>
