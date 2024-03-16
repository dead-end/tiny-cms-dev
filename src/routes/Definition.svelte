<script lang="ts">
    import { location, push } from 'svelte-spa-router'
    import ButtonWrapper from '../components/ButtonWrapper.svelte'
    import CardWrapper from '../components/CardWrapper.svelte'
    import FlexColWrapper from '../components/FlexColWrapper.svelte'
    import FormFields from '../components/FormFields.svelte'
    import { entryGet } from '../ts/entry'
    import type { TData, TDefinition, TField } from '../ts/types'
    import {
        formCreateValidator,
        formDataChanged
    } from '../ts/validation/formValidator'
    import { errorStore } from '../ts/stores/errorStore'
    import { getErrorMsg } from '../ts/libs/utils/utils'
    import {
        getDefinitionFile,
        updateDefinitionFile
    } from '../ts/github/persistFiles'
    import { repoConfigStore } from '../ts/stores/repoConfig'
    import {
        definitionEntryFromFormData,
        definitionEntryToData
    } from '../ts/mappings/definition'
    import { onMount } from 'svelte'
    import { getLastCommit } from '../ts/github/persistUtils'
    import Entry from '../components/Entry.svelte'

    export let params = {
        definition: ''
    }

    let isCreate: boolean = $location.endsWith('/definitions/create')
    let disabled = !isCreate

    let definition: TDefinition
    let commit: string

    let fields: TField[] = entryGet(isCreate)

    let { formErrors, formValidate } = formCreateValidator(fields)
    let data: TData = {}

    const updateDefinition = async (updatedDefinition: TDefinition) => {
        try {
            const commitItem = await updateDefinitionFile(
                $repoConfigStore,
                updatedDefinition.tc_id,
                commit,
                updatedDefinition,
                isCreate
            )

            commit = commitItem.commit
            definition = commitItem.data

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

            const upItem = definitionEntryFromFormData(
                definition,
                isCreate,
                formData
            )

            if (!(await updateDefinition(upItem))) {
                return
            }

            if (isCreate) {
                push('#/definitions')
                return
            }
            disabled = true
        } catch (e) {
            errorStore.set(getErrorMsg(e))
        }
    }

    const initDefinition = () => {
        definition = {
            tc_id: '',
            tc_title: '',
            tc_modified: 0,
            fields: []
        }
    }

    onMount(async () => {
        try {
            if (isCreate) {
                initDefinition()
                commit = await getLastCommit($repoConfigStore)
            } else {
                //
                // Load definition
                //
                const commitDefinition = await getDefinitionFile(
                    $repoConfigStore,
                    params.definition
                )
                definition = commitDefinition.data
                commit = commitDefinition.commit
            }

            data = definitionEntryToData(isCreate, definition, data)
        } catch (e) {
            errorStore.set(getErrorMsg(e))
        }
    })
</script>

<CardWrapper label="Create new Definition">
    <Entry show={!isCreate} entry={definition} {commit} />
    <form on:submit|preventDefault={submit}>
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
                            on:click={() => (disabled = true)}>Cancel</button
                        >
                    {/if}
                {/if}
                <button
                    class="btn-base"
                    type="button"
                    on:click={() => push('#/definitions')}>Definitions</button
                >
            </ButtonWrapper>
        </FlexColWrapper>
    </form>
</CardWrapper>
