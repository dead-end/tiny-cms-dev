import Result from '../libs/result'
import type { TRepoConfig } from '../stores/repoConfig'
import type {
    TCommit,
    TDefinition,
    TEntry,
    TFile,
    TItem,
    TListing
} from '../types'
import { cacheGet, cacheSet } from './cache'
import { ghGetCommit } from './ghGetCommit'
import { ghCheckFile, ghGetFile } from './ghGetFile'
import { ghGetFiles } from './ghGetFiles'
import { ghGetListing } from './ghGetListing'
import { ghUpdateContent } from './ghUpdateFile'

/**
 * The method creates the path for definitions.
 */
const getDefinitionsPath = (config: TRepoConfig) => {
    const result = config.prefix ? config.prefix.concat('/') : ''
    return result.concat('definitions')
}

const getDefinitionPath = (config: TRepoConfig, collection: string) => {
    return getDefinitionsPath(config).concat('/', collection, '.json')
}

/**
 * The method creates the path for a collection.
 */
const getCollectionPath = (config: TRepoConfig, collection: string) => {
    const result = config.prefix ? config.prefix.concat('/') : ''
    return result.concat('collections', '/', collection)
}

/**
 * The method creates the path for an item in a collection.
 */
const getItemPath = (config: TRepoConfig, collection: string, item: string) => {
    return getCollectionPath(config, collection).concat('/', item, '.json')
}

/**
 * The function is called with a directory listing. For each entry it checks if
 * there is a version in the cache. It returns a map of the cached entrys and a
 * list of the uncached entries.
 */
const loadFromCache = (path: string, listings: TListing[]) => {
    const cached = new Map<string, string>()
    const uncached: string[] = []

    for (const listing of listings) {
        const filePath = path.concat('/', listing.name)
        const cachedFile = cacheGet(filePath, listing.oid)
        if (cachedFile) {
            cached.set(listing.oid, cachedFile.text)
        } else {
            uncached.push(filePath)
        }
    }

    return { cached, uncached }
}

/**
 * The function is called with a path of a directory and it returns the entries
 * of that directory with their content. (In fact the entires are items or
 * definitions)
 */
const getListing = async (config: TRepoConfig, path: string) => {
    const res = new Result<TEntry[]>()

    //
    // Get the listing without content
    //
    const resultListing = await ghGetListing(config, path)
    if (resultListing.hasError()) {
        return res.failed(
            `Listing for: ${path} - error: ${resultListing.getError()}`
        )
    }
    const listings = resultListing.getValue()
    //
    // Get the cached content for the listing
    //
    const { cached, uncached } = loadFromCache(path, listings)
    console.log('listing:', listings, 'uncached:', uncached, 'cached:', cached)

    //
    // Get the content of the entries, which are not cached.
    //
    if (uncached.length > 0) {
        const resultFiles = await ghGetFiles(config, uncached)
        if (resultFiles.hasError()) {
            return res.failed(
                `Unable to get files: ${uncached} - ${resultFiles.getError()}`
            )
        }

        resultFiles.getValue().forEach((file) => {
            cacheSet(file)
            cached.set(file.oid, file.text)
        })
    }

    const entries: TEntry[] = []

    for (const listing of listings) {
        let text = cached.get(listing.oid)
        if (!text) {
            return res.failed(
                `Listing for: ${path} file not found: ${listing.name}`
            )
        }
        entries.push(JSON.parse(text))
    }

    return res.success(entries)
}

/**
 * The function returns the directory listing of a collection.
 */
export const getCollectionListing = async (
    config: TRepoConfig,
    collection: string
) => {
    const path = getCollectionPath(config, collection)
    return getListing(config, path)
}

/**
 * The function returns the directory listing of the definitions.
 */
export const getDefinitionsListing = async (config: TRepoConfig) => {
    const path = getDefinitionsPath(config)
    return getListing(config, path)
}

/**
 * The function gets a file for an item or a definition.
 */
const getFile = async <T>(config: TRepoConfig, path: string) => {
    const result = new Result<TCommit<T>>()

    const resultCheck = await ghCheckFile(config, path)
    if (resultCheck.hasError()) {
        return result.failed(
            `Unable to get: ${path} - ${resultCheck.getError()}`
        )
    }
    //
    // Return the cached version, if there is one and it is valid.
    //
    const cached = cacheGet(path, resultCheck.getValue().oid)
    if (cached) {
        console.log('From Cache:', cached)
        return result.success({
            data: JSON.parse(cached.text),
            commit: resultCheck.getValue().commit
        })
    }
    //
    // Get the current version of the file.
    //
    const resultContent = await ghGetFile(config, path)
    if (resultContent.hasError()) {
        return result.failed(
            `Unable to get file: ${path} - ${resultContent.getError()}`
        )
    }
    //
    // Update the cache and return the result.
    //
    const commitFile: TCommit<TFile> = resultContent.getValue()
    cacheSet(commitFile.data)
    console.log('Set Cache:', commitFile)
    return result.success({
        data: JSON.parse(commitFile.data.text),
        commit: commitFile.commit
    })
}

/**
 * The function gets an item file.
 */
export const getItemFile = async (
    config: TRepoConfig,
    collection: string,
    item: string
) => {
    const path = getItemPath(config, collection, item)
    return getFile<TItem>(config, path)
}

/**
 * The function gets a definition file.
 */
export const getDefinitionFile = async (
    config: TRepoConfig,
    collection: string
) => {
    const path = getDefinitionPath(config, collection)
    return getFile<TDefinition>(config, path)
}

/**
 * The function updates an item. (The commit is the commit id)
 */
export const updateItemFile = async (
    config: TRepoConfig,
    collection: string,
    item: string,
    commit: string,
    data: TItem
) => {
    const res = new Result<TCommit<TItem>>()

    if (!collection || !item || !commit || !data) {
        return res.failed('updateItemFile - Insufficient parameter')
    }

    const path = getItemPath(config, collection, item)
    const resultUpdate = await ghUpdateContent(config, path, commit, data)

    if (resultUpdate.hasError()) {
        return res.failed(
            `Unable to get file: ${path} - ${resultUpdate.getError()}`
        )
    }

    cacheSet(resultUpdate.getValue().data)

    return res.success({
        commit: resultUpdate.getValue().commit,
        data: JSON.parse(resultUpdate.getValue().data.text)
    })
}

export const getLastCommit = async (config: TRepoConfig) => {
    return ghGetCommit(config)
}
