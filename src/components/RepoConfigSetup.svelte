<script lang="ts">
    import { repoConfigStore } from '../ts/stores/repoConfig'
    import { formCreateValidator } from '../ts/validation/formValidator'
    import { replace } from 'svelte-spa-router'
    import { formDataStrValue } from '../ts/libs/utils/formData'
    import CardWrapper from './wrappers/CardWrapper.svelte'
    import FormFields from './FormFields.svelte'
    import ButtonWrapper from './wrappers/ButtonWrapper.svelte'
    import { fieldsDefault } from '../ts/libs/utils/fields'
    import FlexColWrapper from './wrappers/FlexColWrapper.svelte'
    import { FRepoConfigFields } from '../ts/fielddefs/repoConfigFields'

    const fields = FRepoConfigFields
    const data = fieldsDefault(fields)

    let { formErrors, formValidate } = formCreateValidator(fields)

    const submit = (event: Event) => {
        const formData = new FormData(event.target as HTMLFormElement)

        if (!formValidate(formData)) {
            formErrors = formErrors
            return
        }

        repoConfigStore.saveRepoConfig(
            {
                owner: formDataStrValue(formData.get('owner')),
                name: formDataStrValue(formData.get('name')),
                branch: formDataStrValue(formData.get('branch')),
                prefix: formDataStrValue(formData.get('prefix')),
                token: formDataStrValue(formData.get('token'))
            },

            formDataStrValue(formData.get('password'))
        )
        replace('/')
    }
</script>

<div class="w-full max-w-xs m-auto">
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
