<script lang="ts">
    import InputWrapper from './InputWrapper.svelte'

    export let label: string
    export let id: string
    export let value: string
    export let type: 'text' | 'password' = 'text'
    export let error: string

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
