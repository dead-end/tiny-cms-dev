<script lang="ts">
    import { repoConfigStore } from '../ts/stores/repoConfig'
    import { formDataStrValue } from '../ts/libs/utils'
    import { formCreateValidator } from '../ts/validation/formValidator'
    import CardWrapper from './CardWrapper.svelte'
    import type { TField } from '../ts/types'
    import InputFields from './InputFields.svelte'
    import ButtonWrapper from './ButtonWrapper.svelte'

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

    let { formErrors, formValidate, formFieldsUpdate } = formCreateValidator()
    formFieldsUpdate(fields)

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
            formErrors.set('password', 'Unable to login!')
            console.log('Unable to login!', e)
        }
    }
</script>

<div class="w-full max-w-xs m-auto">
    <CardWrapper label="Login">
        <form on:submit|preventDefault={submit}>
            <InputFields {fields} {data} {formErrors} disabled={false} />
            <ButtonWrapper>
                <button
                    type="button"
                    class="btn-base"
                    on:click={repoConfigStore.reset}>Reset</button
                >
                <button class="btn-base" type="submit">Submit</button>
            </ButtonWrapper>
        </form>
    </CardWrapper>
</div>
