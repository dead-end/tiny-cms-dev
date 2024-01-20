<script lang="ts">
    import FormWrapper from '../components/FormWrapper.svelte'
    import AreaInput from '../components/input/AreaInput.svelte'
    import TextInput from '../components/input/TextInput.svelte'
    import { repoConfigStore } from '../ts/stores/repoConfig'
</script>

<div class="bg-green-300">
    <h1>Home</h1>
    <button class="btn-base" on:click={repoConfigStore.logout}>Logout</button>

    <div class="w-full max-w-xs m-auto">
        <FormWrapper label="Demo" submit={(e) => console.log(e)}>
            <TextInput label="Text" id="text" value="" error="" type="text" />
            <AreaInput label="Area" id="area" value="" error="" />
        </FormWrapper>
    </div>
</div>
