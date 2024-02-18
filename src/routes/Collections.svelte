<script lang="ts">
    import { componentRegistry } from '../ts/components'
    import { createFormValidator } from '../ts/validation/formValidator'
    import {
        validatorRegistry,
        type TValidatorFunction
    } from '../ts/validation/validators'
    import type { TDefinition } from '../ts/types'
    import CardWrapper from '../components/CardWrapper.svelte'

    const defintion: TDefinition = {
        id: 'search-engine',
        title: 'Search Engine',
        modified: new Date().getTime(),
        fields: [
            {
                id: 'label',
                label: 'Label',
                component: 'text',
                validators: [
                    {
                        validator: 'required'
                    },
                    {
                        validator: 'max',
                        props: {
                            max: 32
                        }
                    }
                ]
            },
            {
                id: 'desc',
                label: 'Description',
                component: 'area',
                validators: [
                    {
                        validator: 'required'
                    }
                ]
            },
            {
                id: 'url',
                label: 'Url',
                component: 'text',
                props: {
                    type: 'text'
                },
                validators: [
                    {
                        validator: 'required'
                    },
                    {
                        validator: 'regex',
                        props: {
                            regex: '^(http://|https://)*'
                        }
                    }
                ]
            }
        ]
    }

    /*
    let data: Record<string, any> = {
        label: 'My Label',
        text: 'My Text',
        date: '2024-01-27',
        number: 10
    }
    */

    let data: Record<string, any> = {}

    const formValidators: Record<string, TValidatorFunction[]> = {}

    let { formErrors, validateForm } = createFormValidator(formValidators)

    const submit = (event: Event) => {
        const formData = new FormData(event.target as HTMLFormElement)

        if (!validateForm(formData)) {
            formErrors = formErrors
            return
        }

        defintion.fields.forEach((field) => {
            data[field.id] = formData.get(field.id)
        })

        console.log(data)
    }

    defintion.fields.forEach((field) => {
        /*
        if (typeof data[field.id] === 'undefined') {
            if (typeof field.value === 'undefined') {
                data[field.id] = ''
            } else {
                data[field.id] = field?.value
            }
        }*/

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

<CardWrapper label={defintion.title}>
    <form on:submit|preventDefault={submit}>
        {#each defintion.fields as field}
            <svelte:component
                this={componentRegistry[field.component]}
                id={field.id}
                label={field.label}
                value={typeof data[field.id] === 'undefined'
                    ? ''
                    : data[field.id]}
                error={formErrors[field.id]}
                {...field.props}
            />
        {/each}
        <button class="btn-base my-4" type="submit">Submit</button>
    </form>
</CardWrapper>
