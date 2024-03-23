<script lang="ts">
    import InputError from '../base/InputError.svelte'
    import InputLabel from '../base/InputLabel.svelte'

    export let id: string
    export let label: string
    export let error: string | undefined
</script>

<div>
    <InputLabel {id} {label} />
    <slot />
    <InputError {error} />
</div>
