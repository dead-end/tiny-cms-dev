<script lang="ts">
    import { repoConfigStore } from '../ts/stores/repoConfig'
    import { formDataStrValue } from '../ts/libs/utils'
    import {
        createFormValidator,
        updateFormValidator
    } from '../ts/validation/formValidator'
    import { type TValidatorFunction } from '../ts/validation/validators'
    import CardWrapper from './CardWrapper.svelte'
    import type { TField } from '../ts/types'
    import InputFields from './InputFields.svelte'

    const fields: TField[] = [
        {
            id: 'password',
            component: 'text',
            type: 'password',
            label: 'Password',
            validators: [
                {
                    validator: 'required'
                }
            ]
        }
    ]

    const data = {
        password: ''
    }

    const formValidators = new Map<string, TValidatorFunction[]>()
    updateFormValidator(formValidators, fields)

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
            formErrors.set('password', 'Unable to login!')
            console.log('Unable to login!', e)
        }
    }
</script>

<div class="w-full max-w-xs m-auto">
    <CardWrapper label="Login">
        <form on:submit|preventDefault={submit}>
            <InputFields {fields} {data} {formErrors} disabled={false} />
            <button
                type="button"
                class="btn-base my-4 mr-2"
                on:click={repoConfigStore.reset}>Reset</button
            >
            <button class="btn-base my-4" type="submit">Submit</button>
        </form>
    </CardWrapper>
</div>
