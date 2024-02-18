<script lang="ts">
    import { repoConfigStore } from '../ts/stores/repoConfig'
    import { formDataStrValue } from '../ts/libs/utils'
    import { createFormValidator } from '../ts/validation/formValidator'
    import {
        validateRequired,
        type TValidatorFunction
    } from '../ts/validation/validators'
    import TextInput from './input/TextInput.svelte'
    import CardWrapper from './CardWrapper.svelte'

    const formValidators: Record<string, TValidatorFunction[]> = {
        password: [validateRequired()]
    }

    let { formErrors, validateForm } = createFormValidator(formValidators)

    const submit = async (event: Event) => {
        const formData = new FormData(event.target as HTMLFormElement)

        if (!validateForm(formData)) {
            formErrors = formErrors
            return
        }

        try {
            await repoConfigStore.login(
                formDataStrValue(formData.get('password'))
            )
        } catch (e) {
            formErrors['password'] = 'Unable to login!'
            console.log('Unable to login!', e)
        }
    }
</script>

<div class="w-full max-w-xs m-auto">
    <CardWrapper label="Login">
        <form on:submit|preventDefault={submit}>
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
            <button class="btn-base my-4" type="submit">Submit</button>
        </form>
    </CardWrapper>
</div>
