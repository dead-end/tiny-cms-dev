<script lang="ts">
    import InputWrapper from './InputWrapper.svelte'

    export let id: string
    export let label: string
    export let value: string
    export let error: string | undefined
    export let disabled = false

    const onblur = () => {
        if (error) {
            error = ''
        }
    }
</script>

<InputWrapper {id} {label} {error}>
    <input
        {id}
        name={id}
        class="input-base"
        type="text"
        {value}
        on:blur={onblur}
        {disabled}
    />
</InputWrapper>
