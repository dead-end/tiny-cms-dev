<script lang="ts">
    import { repoConfigStore } from '../ts/stores/repoConfig'
    import { createFormValidator } from '../ts/validation/formValidator'
    import { replace } from 'svelte-spa-router'
    import {
        type TValidatorFunction,
        validateFieldEquals,
        validateRequired,
        validateMin,
        validateMax
    } from '../ts/validation/validators'
    import TextInput from './input/TextInput.svelte'
    import { formDataStrValue } from '../ts/libs/utils'
    import CardWrapper from './CardWrapper.svelte'

    let owner = ''
    let name = ''
    let branch = 'main'
    let prefix = ''
    let token = ''
    let password = ''
    let confirm = ''

    const formValidators: Record<string, TValidatorFunction[]> = {
        owner: [validateRequired()],
        name: [validateRequired()],
        branch: [validateRequired()],
        token: [validateRequired()],
        password: [
            validateRequired(),
            validateMin({ min: 5 }),
            validateMax({ max: 15 })
        ],
        confirm: [
            validateRequired(),
            validateFieldEquals({
                field: 'password',
                msg: 'Password do not match!'
            })
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
                label="Branch"
                id="branch"
                value={branch}
                error={formErrors['branch']}
                type="text"
            />

            <TextInput
                label="Prefix"
                id="prefix"
                value={prefix}
                error={formErrors['prefix']}
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

            <button class="btn-base my-4" type="submit">Submit</button>
        </form>
    </CardWrapper>
</div>
