<script lang="ts">
    import {
        formCreateValidator,
        formDataChanged
    } from '../ts/validation/formValidator'
    import { itemFromFormData, itemToData } from '../ts/item'
    import {
        getItemFile,
        getDefinitionFile,
        updateItemFile
    } from '../ts/github/persistFiles'
    import { onMount } from 'svelte'
    import { repoConfigStore } from '../ts/stores/repoConfig'
    import { errorStore } from '../ts/stores/errorStore'
    import { location, push } from 'svelte-spa-router'
    import { getErrorMsg } from '../ts/libs/utils/utils'
    import { getLastCommit } from '../ts/github/persistUtils'
    import type { TData, TDefinition, TField, TItem } from '../ts/types'
    import CardWrapper from '../components/CardWrapper.svelte'
    import InputFields from '../components/InputFields.svelte'
    import ButtonWrapper from '../components/ButtonWrapper.svelte'
    import { fieldsDefault } from '../ts/libs/utils/fields'

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

    let fields: TField[] = []
    if (isCreate) {
        fields.push({
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
    fields.push({
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

    let { formErrors, formValidate, formFieldsUpdate } = formCreateValidator()
    let data: TData = {}

    /**
     * Update the item and return a boolean to show success. This is used to
     * prevent a redirect on failures.
     */
    const updateItem = async (updatedItem: TItem) => {
        try {
            const commitItem = await updateItemFile(
                $repoConfigStore,
                params.collection,
                updatedItem.tc_id,
                commit,
                updatedItem
            )

            commit = commitItem.commit
            item = commitItem.data

            return true
        } catch (e) {
            errorStore.set(getErrorMsg(e))
        }

        return false
    }

    const submit = async (event: Event) => {
        try {
            const formData = new FormData(event.target as HTMLFormElement)

            if (!formDataChanged(fields, formData, data)) {
                errorStore.set('The item did not changed!')
                return
            }

            if (!formValidate(formData)) {
                formErrors = formErrors
                return
            }

            const upItem = itemFromFormData(
                item,
                isCreate,
                formData,
                definition.fields
            )

            if (!(await updateItem(upItem))) {
                return
            }

            if (isCreate) {
                push(`#/collection/${params.collection}`)
                return
            }
            disabled = true
        } catch (e) {
            errorStore.set(getErrorMsg(e))
        }
    }

    /**
     * Get an initial item for a creation.
     */
    const initItem = (definition: TDefinition) => {
        item = {
            tc_id: '',
            tc_title: '',
            tc_modified: 0,
            data: fieldsDefault(definition.fields)
        }
    }

    /**
     * Load the item from the repository.
     */
    const loadItem = async () => {
        try {
            const commitItem = await getItemFile(
                $repoConfigStore,
                params.collection,
                params.item
            )

            commit = commitItem.commit
            item = commitItem.data
        } catch (e) {
            errorStore.set(getErrorMsg(e))
        }
    }

    /**
     * Loading the definition of the item.
     */
    const loadDefinition = async () => {
        try {
            const commitDefinition = await getDefinitionFile(
                $repoConfigStore,
                params.collection
            )

            definition = commitDefinition.data
        } catch (e) {
            errorStore.set(getErrorMsg(e))
        }
    }

    /**
     * Load the last commit of the repository.
     */
    const loadCommit = async () => {
        try {
            commit = await getLastCommit($repoConfigStore)
        } catch (e) {
            errorStore.set(getErrorMsg(e))
        }
    }

    /**
     * Load everything on mount.
     */
    onMount(async () => {
        await loadDefinition()

        if (isCreate) {
            initItem(definition)
            await loadCommit()
        } else {
            await loadItem()
        }

        fields = formFieldsUpdate(fields.concat(definition.fields))
        data = itemToData(isCreate, item, data)
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

            <InputFields {fields} {data} {formErrors} {disabled} />

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
