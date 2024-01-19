<script lang="ts">
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

<label for={id} class="label-base mb-2">{label}</label>
<input {id} name={id} class="input-base mb-2" {type} {value} on:blur={onblur} />

{#if error}
    <p class="text-xs text-red-600 pt-2">{error}</p>
{/if}
