<script lang="ts">
    import { onMount } from 'svelte'
    import {
        getDefinitionFile,
        getItemFile,
        updateItemFile
    } from '../ts/github/persistance'
    import { repoConfigStore } from '../ts/stores/repoConfig'
    import type { TDefinition, TItem } from '../ts/types'
    import { componentRegistry } from '../ts/components'
    import {
        createFormValidator,
        updateFormValidator
    } from '../ts/validation/formValidator'
    import { type TValidatorFunction } from '../ts/validation/validators'
    import { errorStore } from '../ts/stores/errorStore'
    import { defaultString } from '../ts/libs/utils'
    import CardWrapper from '../components/CardWrapper.svelte'
    import InputFields from '../components/InputFields.svelte'

    export let params = {
        collection: '',
        item: ''
    }

    let disabled = true
    let definition: TDefinition
    let item: TItem
    let commit: string

    const formValidators = new Map<string, TValidatorFunction[]>()

    let { formErrors, validateForm } = createFormValidator(formValidators)
    console.log('formErrors', formErrors, 'validateForm', validateForm)

    const loadDefinition = async () => {
        const result = await getDefinitionFile(
            $repoConfigStore,
            params.collection
        )

        if (result.hasError()) {
            errorStore.set(result.getError())
            return
        }
        definition = result.getValue().data

        updateFormValidator(formValidators, definition.fields)
    }

    const loadItem = async () => {
        const result = await getItemFile(
            $repoConfigStore,
            params.collection,
            params.item
        )

        if (result.hasError()) {
            errorStore.set(result.getError())
            return
        }
        commit = result.getValue().commit
        item = result.getValue().data
        console.log('item', item, 'commit', commit)
    }

    const updateItem = async () => {
        const result = await updateItemFile(
            $repoConfigStore,
            params.collection,
            params.item,
            commit,
            item
        )

        if (result.hasError()) {
            errorStore.set(result.getError())
            return
        }

        commit = result.getValue().commit
        item = result.getValue().data
    }

    const submit = (event: Event) => {
        const formData = new FormData(event.target as HTMLFormElement)

        if (!validateForm(formData)) {
            formErrors = formErrors
            return
        }

        let changed = false

        definition.fields.forEach((field) => {
            let value = formData.get(field.id)
            if (item.data[field.id] !== value) {
                item.data[field.id] = value
                changed = true
            }
        })

        console.log(item.data)

        if (!changed) {
            errorStore.set('The item did not changed!')
            return
        }
        updateItem()
        disabled = true
    }

    onMount(() => {
        loadItem()
        loadDefinition()
    })
</script>

{#if item && definition}
    <CardWrapper label={`Collection: ${definition.title} Item: ${item.title}`}>
        <form on:submit|preventDefault={submit}>
            <div class="text-sm text-right text-gray-500 pb-4">
                <div>
                    Modifield: {new Date(item.modified).toLocaleString()}
                </div>
                <div>
                    Commit: {commit.substring(0, 7)}
                </div>
            </div>
            <!--
            <InputFields
                fields={definition.fields}
                data={item.data}
                {formErrors}
                {disabled}
            />
-->
            {#each definition.fields as field}
                <svelte:component
                    this={componentRegistry[field.component]}
                    id={field.id}
                    label={field.label}
                    value={defaultString(item.data[field.id])}
                    error={formErrors.get(field.id)}
                    {disabled}
                    {...field.props}
                />
            {/each}

            <div class="my-4 flex gap-4">
                {#if disabled}
                    <button
                        class="btn-base"
                        type="button"
                        on:click={() => (disabled = false)}>Edit</button
                    >
                {:else}
                    <button class="btn-base" type="submit">Submit</button>
                {/if}
            </div>
        </form>
    </CardWrapper>
{/if}
