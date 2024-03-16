<script lang="ts">
    import {
        formCreateValidator,
        formDataChanged
    } from '../ts/validation/formValidator'
    import { itemFromFormData, itemToData } from '../ts/mappings/item'
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
    import CardWrapper from '../components/wrappers/CardWrapper.svelte'
    import FormFields from '../components/FormFields.svelte'
    import ButtonWrapper from '../components/wrappers/ButtonWrapper.svelte'
    import { fieldsDefault } from '../ts/libs/utils/fields'
    import FlexColWrapper from '../components/wrappers/FlexColWrapper.svelte'
    import { entryGet } from '../ts/entry'
    import Entry from '../components/Entry.svelte'

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

    let fields: TField[] = entryGet(isCreate)

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
                updatedItem,
                isCreate
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
     * Load everything on mount.
     */
    onMount(async () => {
        try {
            //
            // Load definition
            //
            const commitDefinition = await getDefinitionFile(
                $repoConfigStore,
                params.collection
            )
            definition = commitDefinition.data

            if (isCreate) {
                initItem(definition)
                commit = await getLastCommit($repoConfigStore)
            } else {
                //
                // Load item
                //
                const commitItem = await getItemFile(
                    $repoConfigStore,
                    params.collection,
                    params.item
                )
                item = commitItem.data
                commit = commitItem.commit
            }

            fields = formFieldsUpdate(fields.concat(definition.fields))
            data = itemToData(isCreate, item, data)
        } catch (e) {
            errorStore.set(getErrorMsg(e))
        }
    })
</script>

{#if item && definition}
    <CardWrapper
        label={`Collection: ${definition.tc_title} Item: ${item.tc_title}`}
    >
        <form on:submit|preventDefault={submit}>
            <Entry show={!isCreate} entry={item} {commit} />

            <FlexColWrapper>
                <FormFields {fields} {data} {formErrors} {disabled} />
                <ButtonWrapper>
                    {#if disabled}
                        <button
                            class="btn-base"
                            type="button"
                            on:click={() => (disabled = false)}>Edit</button
                        >
                    {:else}
                        <button class="btn-base" type="submit">Submit</button>
                        {#if !isCreate}
                            <button
                                class="btn-base"
                                type="button"
                                on:click={() => (disabled = true)}
                                >Cancel</button
                            >
                        {/if}
                    {/if}
                    <button
                        class="btn-base"
                        type="button"
                        on:click={() =>
                            push(`#/collection/${params.collection}`)}
                        >Collection</button
                    >
                </ButtonWrapper>
            </FlexColWrapper>
        </form>
    </CardWrapper>
{/if}
