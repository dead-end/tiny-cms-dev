<script lang="ts">
    import InputWrapper from './InputWrapper.svelte'

    export let id: string
    export let label: string
    export let value: string
    export let error: string

    export let type: 'text' | 'password' | 'date' | 'number' = 'text'

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
        class="input-base mb-2"
        {type}
        {value}
        on:blur={onblur}
    />
</InputWrapper>
