<script lang="ts">
    import InputWrapper from './InputWrapper.svelte'

    export let id: string
    export let label: string
    export let value: string
    export let props: Record<string, any>
    export let error: string | undefined
    export let disabled = false

    let options = (props.options as string).split(',').map((s) => s.trim())

    const onblur = () => {
        if (error) {
            error = ''
        }
    }
</script>

<InputWrapper {id} {label} {error}>
    <select
        {id}
        name={id}
        class="input-base"
        {value}
        on:blur={onblur}
        {disabled}
    >
        {#each options as option}
            <option value={option} selected={option === value}>{option}</option>
        {/each}
    </select>
</InputWrapper>
