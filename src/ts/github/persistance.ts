import { resultError, resultSuccess } from '../libs/result'
import type { TRepoConfig } from '../stores/repoConfig'
import type { TEntry, TListing } from '../types'
import { cacheGet, cacheSet } from './cache'
import { ghGetFiles, ghGetListing } from './github'

/**
 * The method creates the path for a collection.
 */
const getCollectionPath = (config: TRepoConfig, collection: string) => {
    const result = config.prefix ? config.prefix.concat('/') : ''
    return result.concat('collections', '/', collection)
}

/**
 * The method creates the path for definitions.
 */
const getDefinitionsPath = (config: TRepoConfig) => {
    const result = config.prefix ? config.prefix.concat('/') : ''
    return result.concat('definitions')
}

/**
 * The function loads a collection item from the cache.
 */
const loadFromCache = (collectionPath: string, listings: TListing[]) => {
    const cached = new Map<string, string>()
    const uncached: string[] = []

    for (const listing of listings) {
        const itemPath = collectionPath.concat('/', listing.name)
        const cachedItem = cacheGet(itemPath, listing.oid)
        if (cachedItem) {
            cached.set(listing.oid, cachedItem)
        } else {
            uncached.push(itemPath)
        }
    }

    return { cached, uncached }
}

/**
 * The function is called with a path of a directory and it returns the entries
 * of that directory with their content.
 */
const getListing = async <T>(config: TRepoConfig, path: string) => {
    //
    // Get the listing without content
    //
    const resultListing = await ghGetListing(config, path)
    if (resultListing.hasError()) {
        return resultError<T[]>(
            `Unable to get listing for: ${path} - error: ${resultListing.getError()}`
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
            return resultError<T[]>(
                `Unable to get files: ${uncached} - ${resultFiles.getError()}`
            )
        }

        resultFiles.getValue().forEach((file) => {
            cacheSet(file.path, file.oid, file.text)
            cached.set(file.oid, file.text)
        })
    }

    const t: T[] = []

    for (const listing of listings) {
        let file = cached.get(listing.oid)
        if (!file) {
            return resultError<T[]>(
                `Listing for: ${path} file not found: ${listing.name}`
            )
        }
        t.push(JSON.parse(file))
    }

    return resultSuccess(t)
}

export const getCollectionListing = async (
    config: TRepoConfig,
    collection: string
) => {
    const path = getCollectionPath(config, collection)
    return getListing<TEntry>(config, path)
}

export const getDefinitionsListing = async (config: TRepoConfig) => {
    const path = getDefinitionsPath(config)
    return getListing<TEntry>(config, path)
}
