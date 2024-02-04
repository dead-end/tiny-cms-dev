const PREFIX = 'cache-'

/**
 * The function caches a file with an oid in the session storage. No checks are 
 * performed.
 */
export const cacheSet = (path: string, oid: string, content: string) => {
    sessionStorage.setItem(PREFIX + path, JSON.stringify({ oid, content }))
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

    const data = JSON.parse(json) as { oid: string, content: string }
    if (oid !== data.oid) {
        sessionStorage.removeItem(PREFIX + path)
        return
    }

    return data.content
}