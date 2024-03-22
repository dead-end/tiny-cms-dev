import type { TRepoConfig } from '../stores/repoConfig'
import type { TListing } from '../types/files'
import type { TEntry } from '../types/entries'
import { cacheGet, cacheSet } from './cache'
import { getCollectionPath, getDefinitionsPath } from './paths'
import { ghGetFiles } from './queries/ghGetFiles'
import { ghGetListing } from './queries/ghGetListing'

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
    const listings = await ghGetListing(config, path)
    const { cached, uncached } = loadFromCache(path, listings)

    // console.log('listing:', listings, 'uncached:', uncached, 'cached:', cached)

    if (uncached.length > 0) {
        const files = await ghGetFiles(config, uncached)

        files.forEach((file) => {
            cacheSet(file)
            cached.set(file.oid, file.text)
        })
    }

    const entries: TEntry[] = []

    for (const listing of listings) {
        let text = cached.get(listing.oid)
        if (!text) {
            throw new Error(
                `Listing for: ${path} file not found: ${listing.name}`
            )
        }
        entries.push(JSON.parse(text))
    }

    return entries
}

/**
 * The function returns the directory listing of a collection.
 */
export const getCollectionListing = async (
    config: TRepoConfig,
    collection: string
) => {
    if (!collection) {
        throw new Error('getCollectionListing - Insufficient parameter')
    }

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
