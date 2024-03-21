<script lang="ts">
    import FormFields from '../components/FormFields.svelte'
    import ButtonWrapper from '../components/wrappers/ButtonWrapper.svelte'
    import CardWrapper from '../components/wrappers/CardWrapper.svelte'
    import FlexColWrapper from '../components/wrappers/FlexColWrapper.svelte'
    import { FValidators } from '../ts/fielddefs/validatorFields'
    import { fieldsDefault } from '../ts/libs/utils/fields'
    import { formCreateValidator } from '../ts/validation/formValidator'

    const fields = FValidators

    let { formErrors, formValidate } = formCreateValidator(fields)
    const data = fieldsDefault(fields)

    const submit = async (event: Event) => {
        const formData = new FormData(event.target as HTMLFormElement)
        console.log(formData)

        if (!formValidate(formData)) {
            formErrors = formErrors
            return
        }
    }
</script>

<div>
    <h1>Home</h1>

    <CardWrapper label="Login">
        <form on:submit|preventDefault={submit}>
            <FlexColWrapper>
                <FormFields {fields} {data} {formErrors} disabled={false} />
                <ButtonWrapper>
                    <button class="btn-base" type="submit">Submit</button>
                </ButtonWrapper>
            </FlexColWrapper>
        </form>
    </CardWrapper>
</div>
