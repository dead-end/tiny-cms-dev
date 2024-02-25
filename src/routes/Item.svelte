<script lang="ts">
    import { onMount } from 'svelte'
    import {
        getDefinitionFile,
        getItemFile,
        getLastCommit,
        updateItemFile
    } from '../ts/github/persistance'
    import { repoConfigStore } from '../ts/stores/repoConfig'
    import type { TDefinition, TField, TItem } from '../ts/types'
    import {
        formCreateValidator,
        formDataChanged
    } from '../ts/validation/formValidator'
    import { errorStore } from '../ts/stores/errorStore'
    import CardWrapper from '../components/CardWrapper.svelte'
    import InputFields from '../components/InputFields.svelte'
    import ButtonWrapper from '../components/ButtonWrapper.svelte'
    import { location, push } from 'svelte-spa-router'
    import { itemFromFormData, item2Data, item2Meta } from '../ts/item'

    export let params = {
        collection: '',
        item: ''
    }

    let isCreate: boolean = $location.endsWith(
        `/collection/${params.collection}/create`
    )
    let disabled = !isCreate

    let definition: TDefinition
    let item: TItem
    let commit: string

    const metaFields: TField[] = []
    if (isCreate) {
        metaFields.push({
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
        })
    }
    metaFields.push({
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
    })

    let {
        formErrors: formErrorsMeta,
        formValidate: formValidateMeta,
        formFieldsUpdate: formFieldsUpdateMeta
    } = formCreateValidator()
    let metaData: Record<string, string> = {}

    let {
        formErrors: formErrorsData,
        formValidate: formValidateData,
        formFieldsUpdate: formFieldsUpdateData
    } = formCreateValidator()
    let itemData: Record<string, string> = {}

    const updateItem = async (updatedItem: TItem) => {
        const result = await updateItemFile(
            $repoConfigStore,
            params.collection,
            updatedItem.tc_id,
            commit,
            updatedItem
        )

        if (result.hasError()) {
            errorStore.set(result.getError())
            return false
        }

        commit = result.getValue().commit
        item = result.getValue().data
        return true
    }

    const submit = async (event: Event) => {
        const formData = new FormData(event.target as HTMLFormElement)

        //
        // Check errors
        //
        let hasError = false

        if (!formValidateMeta(formData)) {
            formErrorsMeta = formErrorsMeta
            hasError = true
        }

        if (!formValidateData(formData)) {
            formErrorsData = formErrorsData
            hasError = true
        }

        if (hasError) {
            return
        }

        //
        // Check changed
        //
        const changedData = formDataChanged(
            definition.fields,
            formData,
            itemData
        )
        const changedMeta = formDataChanged(metaFields, formData, metaData)

        if (!changedData && !changedMeta) {
            errorStore.set('The item did not changed!')
            return
        }

        //
        // Update
        //
        const result = itemFromFormData(
            item,
            isCreate,
            formData,
            definition.fields
        )
        if (result.hasError()) {
            errorStore.set(result.getError())
            return
        }

        if (!(await updateItem(result.getValue()))) {
            return
        }

        //
        // After update
        //
        if (isCreate) {
            push(`#/collection/${params.collection}`)
            return
        }
        disabled = true
    }

    const initItem = (definition: TDefinition) => {
        const newItem: TItem = {
            tc_id: '',
            tc_title: '',
            tc_modified: 0,
            data: {}
        }

        definition.fields.forEach((field) => {
            newItem.data[field.id] = field.value
        })

        item = newItem
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
    }

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
    }

    const loadCommit = async () => {
        const result = await getLastCommit($repoConfigStore)

        if (result.hasError()) {
            errorStore.set(result.getError())
            return
        }

        commit = result.getValue()
    }

    onMount(async () => {
        await loadDefinition()

        if (isCreate) {
            initItem(definition)
            await loadCommit()
        } else {
            await loadItem()
        }

        formFieldsUpdateData(definition.fields)
        formFieldsUpdateMeta(metaFields)

        metaData = item2Meta(isCreate, item, metaData)
        itemData = item2Data(item, itemData)
    })
</script>

{#if item && definition}
    <CardWrapper
        label={`Collection: ${definition.tc_title} Item: ${item.tc_title}`}
    >
        <form on:submit|preventDefault={submit}>
            {#if !isCreate}
                <div class="text-sm text-right text-gray-500 pb-4">
                    <div>
                        Modifield: {new Date(item.tc_modified).toLocaleString()}
                    </div>
                    <div>
                        Commit: {commit.substring(0, 7)}
                    </div>
                </div>

                <h3 class="pb-4">ID: {item.tc_id}</h3>
            {/if}

            <InputFields
                fields={metaFields}
                data={metaData}
                formErrors={formErrorsMeta}
                {disabled}
            />

            <InputFields
                fields={definition.fields}
                data={itemData}
                formErrors={formErrorsData}
                {disabled}
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
                <button
                    class="btn-base"
                    type="button"
                    on:click={() => push(`#/collection/${params.collection}`)}
                    >Collection</button
                >
            </ButtonWrapper>
        </form>
    </CardWrapper>
{/if}
