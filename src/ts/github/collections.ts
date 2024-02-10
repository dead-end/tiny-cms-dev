import { resultError, resultSuccess } from '../libs/result'
import type { TRepoConfig } from '../stores/repoConfig'
import type { TItem } from '../types'
import { cacheGet, cacheSet } from './cache'
import { ghGetFiles, ghGetListing, type TListing } from './github'

/**
 * The method creates the path for a collection.
 */
const getCollectionPath = (config: TRepoConfig, collection: string) => {
    const result = config.prefix ? config.prefix.concat('/') : ''
    return result.concat('collections', '/', collection)
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
 * The function gets the items of a collection from cache or from the server.
 */
export const colGetCollection = async (
    config: TRepoConfig,
    collection: string
) => {
    const collectionPath = getCollectionPath(config, collection)

    const resultListing = await ghGetListing(config, collectionPath)
    if (resultListing.hasError()) {
        return resultError<TItem[]>(
            `Unable to get collection: ${collection} - error: ${resultListing.getError()}`
        )
    }
    const listings = resultListing.getValue()
    const { cached, uncached } = loadFromCache(collectionPath, listings)

    console.log('listing:', listings, 'uncached:', uncached, 'cached:', cached)

    const fetched = new Map<string, string>()
    if (uncached.length > 0) {
        const resultFiles = await ghGetFiles(config, uncached)
        if (resultFiles.hasError()) {
            return resultError<TItem[]>(
                `Unable to get files: ${uncached} - ${resultFiles.getError()}`
            )
        }

        resultFiles
            .getValue()
            .forEach((file) => fetched.set(file.oid, file.text))
    }

    const items: TItem[] = []

    for (const listing of listings) {
        let item = cached.get(listing.oid)
        if (!item) {
            item = fetched.get(listing.oid)
            if (!item) {
                return resultError<TItem[]>(
                    `Collection: ${collection} item not found: ${listing.name}`
                )
            }

            const itemPath = collectionPath.concat('/', listing.name)
            cacheSet(itemPath, listing.oid, item)
        }
        items.push(JSON.parse(item))
    }

    return resultSuccess(items)
}
