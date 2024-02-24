<script lang="ts">
    import { componentRegistry } from '../ts/components'
    import { formCreateValidator } from '../ts/validation/formValidator'
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

    let data: Record<string, any> = {}

    let { formErrors, formValidate, formFieldsUpdate } = formCreateValidator()
    formFieldsUpdate(defintion.fields)

    const submit = (event: Event) => {
        const formData = new FormData(event.target as HTMLFormElement)

        if (!formValidate(formData)) {
            formErrors = formErrors
            return
        }

        defintion.fields.forEach((field) => {
            data[field.id] = formData.get(field.id)
        })

        console.log(data)
    }
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
                error={formErrors.get(field.id)}
                {...field.props}
            />
        {/each}
        <button class="btn-base my-4" type="submit">Submit</button>
    </form>
</CardWrapper>
