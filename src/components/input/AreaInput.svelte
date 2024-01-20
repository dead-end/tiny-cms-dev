<script lang="ts">
    import ErrorComp from './ErrorComp.svelte'
    import LabelComp from './LabelComp.svelte'

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

<LabelComp {id} {label} />
<textarea {id} name={id} class="input-base mb-2" {value} on:blur={onblur} />
<ErrorComp {error} />
