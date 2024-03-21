/**
 * The definition of an entry of a directory listing on github.
 */
export type TListing = {
    name: string
    type: string
    oid: string
}

/**
 * The definition of a file with its content on github.
 */
export type TFile = {
    path: string
    oid: string
    text: string
}

/**
 * If we want to update a file, we need the oid and the commit id.
 */
export type TCheckFile = {
    oid: string | null
    path: string
    commit: string
}

/**
 * With a commit id
 */
export type TCommit<T> = {
    data: T
    commit: string
}
