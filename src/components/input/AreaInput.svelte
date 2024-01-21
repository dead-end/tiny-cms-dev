<script lang="ts">
    import InputWrapper from './InputWrapper.svelte'

    export let label: string
    export let id: string
    export let value: string
    export let error: string

    const onblur = () => {
        if (error) {
            error = ''
        }
    }
</script>

<InputWrapper {id} {label} {error}>
    <textarea {id} name={id} class="input-base mb-2" {value} on:blur={onblur} />
</InputWrapper>
