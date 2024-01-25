<script lang="ts">
    import FormWrapper from '../components/FormWrapper.svelte'
    import AreaInput from '../components/input/AreaInput.svelte'
    import TextInput from '../components/input/TextInput.svelte'
</script>

<div>
    <h1>Home</h1>
    <div class="max-w-xs m-auto">
        <FormWrapper label="Demo" submit={(e) => console.log(e)}>
            <TextInput label="Text" id="text" value="" error="" type="text" />
            <AreaInput label="Area" id="area" value="" error="" />
        </FormWrapper>
    </div>
</div>
