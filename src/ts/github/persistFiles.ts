import type { TRepoConfig } from '../types/repoConfig'
import type { TCommit } from '../types/files'
import type { TDefinition, TItem } from '../types/entries'
import { cacheGet, cacheRemove, cacheSet } from './cache'
import { getItemPath, getDefinitionPath } from './paths'
import { ghDeleteFile } from './queries/ghDeleteFile'
import { ghCheckFile, ghGetFile } from './queries/ghGetFile'
import { ghUpdateContent } from './queries/ghUpdateFile'

/**
 * The function gets a file for an item or a definition.
 */
const getFile = async <T>(config: TRepoConfig, path: string) => {
    const checkFile = await ghCheckFile(config, path)

    //
    // File does not exist on the HEAD of the branch.
    //
    if (checkFile.oid === null) {
        throw new Error(`File does not exist: ${path}`)
    }

    //
    // Check if the path with the oid of the HEAD exists in the cache. Older
    // versions are deleted.
    //
    const cached = cacheGet(path, checkFile.oid)
    if (cached) {
        const result: TCommit<T> = {
            data: JSON.parse(cached.text),
            commit: checkFile.commit
        }
        return result
    }

    //
    // Get the file from the HEAD with its content and update the cache.
    //
    const commitFile = await ghGetFile(config, path)
    cacheSet(commitFile.data)

    const result: TCommit<T> = {
        data: JSON.parse(commitFile.data.text),
        commit: commitFile.commit
    }
    return result
}

/**
 * The function returns true if the file exists on the branch with the given
 * commit. If the commit does not match, we throw an error, because our version
 * is stale and we need a refresh.
 */
const existsFile = async (
    config: TRepoConfig,
    path: string,
    commit: string
) => {
    const checkFile = await ghCheckFile(config, path)
    if (checkFile.commit !== commit) {
        throw new Error(`Current commit: ${checkFile.commit} is not: ${commit}`)
    }
    return checkFile.oid !== null
}

/**
 * The function gets an item file.
 */
export const getItemFile = async (
    config: TRepoConfig,
    collection: string,
    id: string
) => {
    if (!collection || !id) {
        throw new Error('getItemFile - Insufficient parameter')
    }

    const path = getItemPath(config, collection, id)
    return getFile<TItem>(config, path)
}

/**
 * The function updates an item. (The commit is the commit id)
 */
export const updateItemFile = async (
    config: TRepoConfig,
    collection: string,
    id: string,
    commit: string,
    data: TItem,
    create: boolean
) => {
    if (!collection || !id || !commit || !data) {
        throw new Error('updateItemFile - Insufficient parameter')
    }

    const path = getItemPath(config, collection, id)
    if (create && (await existsFile(config, path, commit))) {
        throw new Error(`Item with id: ${id} already exists!`)
    }
    const commitFile = await ghUpdateContent(config, path, commit, data)

    cacheSet(commitFile.data)

    const result: TCommit<TItem> = {
        commit: commitFile.commit,
        data: JSON.parse(commitFile.data.text)
    }
    return result
}

/**
 * The function deletes a file.
 */
export const deleteItemFile = async (
    config: TRepoConfig,
    collection: string,
    id: string,
    commit: string
) => {
    if (!collection || !id || !commit) {
        throw new Error('deleteItemFile - Insufficient parameter')
    }

    const path = getItemPath(config, collection, id)
    const newCommit = await ghDeleteFile(config, path, commit)

    cacheRemove(path)

    return newCommit
}

/**
 * The function gets a definition file.
 */
export const getDefinitionFile = async (config: TRepoConfig, id: string) => {
    if (!id) {
        throw new Error('getDefinitionFile - Insufficient parameter')
    }

    const path = getDefinitionPath(config, id)
    return getFile<TDefinition>(config, path)
}

/**
 * The function updates a definition file.
 */
export const updateDefinitionFile = async (
    config: TRepoConfig,
    id: string,
    commit: string,
    data: TDefinition,
    create: boolean
) => {
    if (!id || !commit || !data) {
        throw new Error('updateDefinitionFile - Insufficient parameter')
    }

    const path = getDefinitionPath(config, id)
    if (create && (await existsFile(config, path, commit))) {
        throw new Error(`Definition with id: ${id} already exists!`)
    }
    const commitFile = await ghUpdateContent(config, path, commit, data)

    cacheSet(commitFile.data)

    const result: TCommit<TDefinition> = {
        commit: commitFile.commit,
        data: JSON.parse(commitFile.data.text)
    }
    return result
}

/**
 * The function deletes a definition file.
 */
export const deleteDefinitionFile = async (
    config: TRepoConfig,
    id: string,
    commit: string
) => {
    if (!id || !commit) {
        throw new Error('deleteDefinitionFile - Insufficient parameter')
    }

    const path = getDefinitionPath(config, id)
    const newCommit = await ghDeleteFile(config, path, commit)

    cacheRemove(path)

    return newCommit
}
