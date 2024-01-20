<script lang="ts">
    import { repoConfigStore } from '../ts/stores/repoConfig'
    import { createFormValidator } from '../ts/validation/formValidator'
    import { replace } from 'svelte-spa-router'
    import {
        requiredValidator,
        validateMinMax,
        type TValidator,
        validateFieldEquals
    } from '../ts/validation/validators'

    import FormWrapper from './FormWrapper.svelte'
    import TextInput from './input/TextInput.svelte'
    import { formDataStrValue } from '../ts/libs/utils'

    let owner = ''
    let name = ''
    let token = ''
    let password = ''
    let confirm = ''

    const formValidators: Record<string, TValidator[]> = {
        owner: [requiredValidator],
        name: [requiredValidator],
        token: [requiredValidator],
        password: [requiredValidator, validateMinMax({ min: 5, max: 15 })],
        confirm: [
            requiredValidator,
            validateFieldEquals('password', 'Password do not match!')
        ]
    }

    let { formErrors, validateForm } = createFormValidator(formValidators)

    const submit = (event: Event) => {
        const formData = new FormData(event.target as HTMLFormElement)

        if (!validateForm(formData)) {
            formErrors = formErrors
            return
        }

        repoConfigStore.saveRepoConfig(
            {
                owner: formDataStrValue(formData.get('owner')),
                name: formDataStrValue(formData.get('name')),
                token: formDataStrValue(formData.get('token'))
            },

            formDataStrValue(formData.get('password'))
        )
        replace('/home')
    }
</script>

<div class="w-full max-w-xs m-auto">
    <FormWrapper label="Login" {submit}>
        <TextInput
            label="Repository Owner"
            id="owner"
            value={owner}
            error={formErrors['owner']}
            type="text"
        />

        <TextInput
            label="Repository Name"
            id="name"
            value={name}
            error={formErrors['name']}
            type="text"
        />

        <TextInput
            label="Token"
            id="token"
            value={token}
            error={formErrors['token']}
            type="password"
        />

        <TextInput
            label="Password"
            id="password"
            value={password}
            error={formErrors['password']}
            type="password"
        />

        <TextInput
            label="Confirmation"
            id="confirm"
            value={confirm}
            error={formErrors['confirm']}
            type="password"
        />
    </FormWrapper>
</div>
