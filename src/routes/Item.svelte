<script lang="ts">
    import { onMount } from 'svelte'
    import {
        getDefinitionFile,
        getItemFile,
        updateItemFile
    } from '../ts/github/persistance'
    import { repoConfigStore } from '../ts/stores/repoConfig'
    import type { TDefinition, TItem } from '../ts/types'
    import { formCreateValidator } from '../ts/validation/formValidator'
    import { errorStore } from '../ts/stores/errorStore'
    import CardWrapper from '../components/CardWrapper.svelte'
    import InputFields from '../components/InputFields.svelte'
    import ButtonWrapper from '../components/ButtonWrapper.svelte'

    export let params = {
        collection: '',
        item: ''
    }

    let disabled = true
    let disableFct: (id: string) => boolean
    $: disableFct = disabled
        ? (id: string) => true
        : (id: string) => id === 'tc_id'

    let definition: TDefinition
    let item: TItem
    let commit: string

    const metaFields = [
        {
            id: 'tc_id',
            component: 'text',
            label: 'Id',
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
            id: 'tc_title',
            component: 'text',
            label: 'Title',
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
        }
    ]

    let {
        formErrors: formErrorsMeta,
        formValidate: formValidateMeta,
        formFieldsUpdate: formFieldsUpdateMeta
    } = formCreateValidator()
    formFieldsUpdateMeta(metaFields)
    let metaData: Record<string, string> = {}

    let { formErrors, formValidate, formFieldsUpdate } = formCreateValidator()

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

        formFieldsUpdate(definition.fields)
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

        metaData['tc_id'] = item.tc_id
        metaData['tc_title'] = item.tc_title
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

        if (!formValidate(formData)) {
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
    <CardWrapper
        label={`Collection: ${definition.tc_title} Item: ${item.tc_title}`}
    >
        <form on:submit|preventDefault={submit}>
            <div class="text-sm text-right text-gray-500 pb-4">
                <div>
                    Modifield: {new Date(item.tc_modified).toLocaleString()}
                </div>
                <div>
                    Commit: {commit.substring(0, 7)}
                </div>
            </div>

            <InputFields
                fields={metaFields}
                data={metaData}
                formErrors={formErrorsMeta}
                {disableFct}
            />

            <InputFields
                fields={definition.fields}
                data={item.data}
                {formErrors}
                {disableFct}
            />

            <ButtonWrapper>
                {#if disabled}
                    <button
                        class="btn-base"
                        type="button"
                        on:click={() => (disabled = false)}>Edit</button
                    >
                {:else}
                    <button class="btn-base" type="submit">Submit</button>
                    <button
                        class="btn-base"
                        type="button"
                        on:click={() => (disabled = true)}>Cancel</button
                    >
                {/if}
            </ButtonWrapper>
        </form>
    </CardWrapper>
{/if}
