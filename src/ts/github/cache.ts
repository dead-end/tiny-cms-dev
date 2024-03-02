import type { TFile } from '../types'

const PREFIX = 'cache@'

/**
 * The function caches a file with an oid in the session storage. No checks are
 * performed.
 */
export const cacheSet = (file: TFile) => {
    sessionStorage.setItem(PREFIX + file.path, JSON.stringify(file))
}

/**
 * The function reads the file content from the cache if the oid is valid (the
 * same).
 */
export const cacheGet = (path: string, oid: string) => {
    const json = sessionStorage.getItem(PREFIX + path)
    if (!json) {
        return
    }

    const file = JSON.parse(json) as TFile
    if (oid !== file.oid) {
        sessionStorage.removeItem(PREFIX + path)
        return
    }

    return file
}

/**
 * The function removes an item from the cache.
 */
export const cacheRemove = (path: string) => {
    sessionStorage.removeItem(PREFIX + path)
}
