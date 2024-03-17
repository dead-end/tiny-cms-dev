<script lang="ts">
    import { repoConfigStore } from '../ts/stores/repoConfig'
    import { formDataStrValue } from '../ts/libs/utils/formData'
    import { formCreateValidator } from '../ts/validation/formValidator'
    import CardWrapper from './wrappers/CardWrapper.svelte'
    import FormFields from './FormFields.svelte'
    import ButtonWrapper from './wrappers/ButtonWrapper.svelte'
    import FlexColWrapper from './wrappers/FlexColWrapper.svelte'
    import { FLoginFields } from '../ts/fielddefs/loginFields'

    const fields = FLoginFields

    const data = {
        password: ''
    }

    let { formErrors, formValidate } = formCreateValidator(fields)

    const submit = async (event: Event) => {
        const formData = new FormData(event.target as HTMLFormElement)

        if (!formValidate(formData)) {
            formErrors = formErrors
            return
        }

        try {
            await repoConfigStore.login(
                formDataStrValue(formData.get('password'))
            )
        } catch (e) {
            formErrors = formErrors.set('password', 'Unable to login!')
        }
    }
</script>

<div class="w-full max-w-xs m-auto">
    <CardWrapper label="Login">
        <form on:submit|preventDefault={submit}>
            <FlexColWrapper>
                <FormFields {fields} {data} {formErrors} disabled={false} />
                <ButtonWrapper>
                    <button
                        type="button"
                        class="btn-base"
                        on:click={repoConfigStore.reset}>Reset</button
                    >
                    <button class="btn-base" type="submit">Submit</button>
                </ButtonWrapper>
            </FlexColWrapper>
        </form>
    </CardWrapper>
</div>
