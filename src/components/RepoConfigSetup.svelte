<script lang="ts">
    import { repoConfigStore } from '../ts/stores/repoConfig'
    import { formCreateValidator } from '../ts/validation/formValidator'
    import { replace } from 'svelte-spa-router'
    import { formDataStrValue } from '../ts/libs/utils'
    import CardWrapper from './CardWrapper.svelte'
    import type { TData, TField } from '../ts/types'
    import InputFields from './InputFields.svelte'
    import ButtonWrapper from './ButtonWrapper.svelte'
    import { fieldsDefault } from '../ts/item'

    const fields: TField[] = [
        {
            id: 'owner',
            label: 'Repository Owner',
            component: 'text',
            value: '',
            validators: [
                {
                    validator: 'required'
                }
            ]
        },
        {
            id: 'name',
            label: 'Repository Name',
            component: 'text',
            value: '',
            validators: [
                {
                    validator: 'required'
                }
            ]
        },
        {
            id: 'branch',
            label: 'Branch',
            component: 'text',
            value: 'main',
            validators: [
                {
                    validator: 'required'
                }
            ]
        },
        {
            id: 'prefix',
            label: 'Prefix',
            component: 'text',
            value: '',
            validators: []
        },
        {
            id: 'token',
            label: 'Token',
            component: 'text',
            type: 'password',
            value: '',
            validators: [
                {
                    validator: 'required'
                }
            ]
        },
        {
            id: 'password',
            label: 'Password',
            component: 'text',
            type: 'password',
            value: '',
            validators: [
                {
                    validator: 'required'
                },
                {
                    validator: 'min',
                    props: {
                        min: 5
                    }
                },
                {
                    validator: 'max',
                    props: {
                        max: 15
                    }
                }
            ]
        },
        {
            id: 'confirm',
            label: 'Confirm',
            component: 'text',
            type: 'password',
            value: '',
            validators: [
                {
                    validator: 'required'
                },
                {
                    validator: 'fieldEquals',
                    props: {
                        field: 'password',
                        msg: 'Password do not match!'
                    }
                }
            ]
        }
    ]

    const data = fieldsDefault(fields)

    let { formErrors, formValidate, formFieldsUpdate } = formCreateValidator()
    formFieldsUpdate(fields)

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
            <InputFields {fields} {data} {formErrors} disabled={false} />
            <ButtonWrapper>
                <button class="btn-base" type="submit">Submit</button>
            </ButtonWrapper>
        </form>
    </CardWrapper>
</div>
