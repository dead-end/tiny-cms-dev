import type { TRepoConfig } from '../stores/repoConfig'
import type { TCommit, TDefinition, TItem } from '../types'
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

    const cached = cacheGet(path, checkFile.oid)
    if (cached) {
        const result: TCommit<T> = {
            data: JSON.parse(cached.text),
            commit: checkFile.commit
        }
        return result
    }

    const commitFile = await ghGetFile(config, path)
    cacheSet(commitFile.data)

    const result: TCommit<T> = {
        data: JSON.parse(commitFile.data.text),
        commit: commitFile.commit
    }
    return result
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
    data: TItem
) => {
    if (!collection || !id || !commit || !data) {
        throw new Error('updateItemFile - Insufficient parameter')
    }

    const path = getItemPath(config, collection, id)
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
    data: TDefinition
) => {
    if (!id || !commit || !data) {
        throw new Error('updateDefinitionFile - Insufficient parameter')
    }

    const path = getDefinitionPath(config, id)
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
