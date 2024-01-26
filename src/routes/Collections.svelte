<script lang="ts">
    import { componentRegistry } from '../ts/components'
    import FormWrapper from '../components/FormWrapper.svelte'
    import { createFormValidator } from '../ts/validation/formValidator'
    import {
        validatorRegistry,
        type TValidator
    } from '../ts/validation/validators'

    const defintion = {
        label: 'My Collection',
        fields: [
            {
                id: 'label',
                label: 'Label',
                component: 'text',
                value: 'default',
                props: {
                    type: 'text'
                },
                validators: [
                    {
                        validator: 'required'
                    },
                    {
                        validator: 'max',
                        props: {
                            max: 30
                        }
                    }
                ]
            },
            {
                id: 'text',
                label: 'Text',
                component: 'area',
                value: 'default',
                validators: [
                    {
                        validator: 'required'
                    },
                    {
                        validator: 'max',
                        props: {
                            max: 10
                        }
                    }
                ]
            }
        ]
    }

    let data: Record<string, any> = {}

    const formValidators: Record<string, TValidator[]> = {}

    let { formErrors, validateForm } = createFormValidator(formValidators)

    const submit = (event: Event) => {
        const formData = new FormData(event.target as HTMLFormElement)

        if (!validateForm(formData)) {
            formErrors = formErrors
            return
        }
    }

    defintion.fields.forEach((field) => {
        data[field.id] = field.value
        formValidators[field.id] = []

        field.validators.forEach((validator) => {
            try {
                formValidators[field.id].push(
                    validatorRegistry[validator.validator](validator.props)
                )
            } catch (e) {
                console.log('Field:', field.id, e)
            }
        })
    })
</script>

<FormWrapper label={defintion.label} {submit}>
    {#each defintion.fields as field}
        <svelte:component
            this={componentRegistry[field.component]}
            id={field.id}
            label={field.label}
            value={data[field.id]}
            error={formErrors[field.id]}
            {...field.props}
        />
    {/each}
</FormWrapper>
