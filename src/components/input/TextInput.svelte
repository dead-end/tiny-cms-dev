<script lang="ts">
    import ErrorComp from './ErrorComp.svelte'
    import LabelComp from './LabelComp.svelte'

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

<LabelComp {id} {label} />
<input {id} name={id} class="input-base mb-2" {type} {value} on:blur={onblur} />
<ErrorComp {error} />
