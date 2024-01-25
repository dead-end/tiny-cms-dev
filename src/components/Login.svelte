<script lang="ts">
    import { repoConfigStore } from '../ts/stores/repoConfig'
    import { formDataStrValue } from '../ts/libs/utils'
    import { createFormValidator } from '../ts/validation/formValidator'
    import {
        validateRequired,
        type TValidator
    } from '../ts/validation/validators'

    import FormWrapper from './FormWrapper.svelte'
    import TextInput from './input/TextInput.svelte'

    const formValidators: Record<string, TValidator[]> = {
        password: [validateRequired()]
    }

    let { formErrors, validateForm } = createFormValidator(formValidators)

    const submit = (event: Event) => {
        const formData = new FormData(event.target as HTMLFormElement)

        if (!validateForm(formData)) {
            formErrors = formErrors
            return
        }

        repoConfigStore.login(formDataStrValue(formData.get('password')))
    }
</script>

<div class="w-full max-w-xs m-auto">
    <FormWrapper label="Login" {submit}>
        <TextInput
            label="Password"
            id="password"
            value=""
            error={formErrors['password']}
            type="password"
        />
        <button
            type="button"
            class="btn-base my-4 mr-2"
            on:click={repoConfigStore.reset}>Reset</button
        >
    </FormWrapper>
</div>
