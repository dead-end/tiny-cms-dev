import { resultError, resultSuccess } from '../libs/result'
import type { TRepoConfig } from '../stores/repoConfig'

const GQL_URL = 'https://api.github.com/graphql'

export type TFile = {
    text: string
    oid: string
}

export type TListing = {
    name: string
    type: string
    oid: string
}

const updateContentQuery = (
    owner: string,
    name: string,
    branch: string,
    oid: string,
    path: string,
    content: string
) => {
    const query = `
    mutation ($committableBranch: CommittableBranch!, $path: String!, $content: Base64String!, $oid: GitObjectID!) {
        createCommitOnBranch (input: {
            branch : $committableBranch
            message: {
                headline: "Update file content"
            }
            fileChanges: {
                additions: [{
                    path: $path
                    contents: $content
                }]
            }
            expectedHeadOid: $oid
        }) {
            commit {
                commitUrl
            }
        }
    }
    `

    const variables = {
        committableBranch: {
            repositoryNameWithOwner: `${owner}/${name}`,
            branchName: branch
        },
        path: path,
        content: content,
        oid: oid
    }

    return { query, variables }
}

/**
 * The query requests the last commit id of the given branch.
 */
const lastCommitQuery = (owner: string, name: string, branch: string) => {
    const query = `
    query LastCommit($owner: String!, $name: String!, $branch: String!) {
        repository(owner: $owner, name: $name) {
            ref (qualifiedName: $branch) {
                target {
                    ... on Commit {
                        history(first: 1) {
                            nodes {
                                oid
                            }
                        }
                    }
                }
            }
        }
    }
    `

    const variables = {
        owner: owner,
        name: name,
        branch: branch
    }

    return { query, variables }
}

// TODO: pagination
const getListingQuery = (
    owner: string,
    name: string,
    branch: string,
    path: string
) => {
    const query = `
    query Listing($owner: String!, $name: String!, $path: String!) {
        repository(owner: $owner, name: $name) {
          object(expression: $path) {
            ... on Tree {
              entries {
                name
                type
                oid
              }
            }
          }
        }
      }
        `
    const variables = {
        owner: owner,
        name: name,
        path: `${branch}:${path}`
    }

    return { query, variables }
}

/**
 * The function returns a graphql query to get the content of files in a
 * directory.
 */
const filesQuery = (
    owner: string,
    name: string,
    branch: string,
    paths: string[]
) => {
    const arr: string[] = []

    arr.push(`
    query getFile($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
    `)

    let count = 0

    paths.forEach((path) => {
        arr.push(`
        file${count++}: object(expression: "${branch}:${path}") {
            ... on Blob {
              text
              oid
            }
          }
        `)
    })

    arr.push(`
        }
    }
    `)

    return {
        query: arr.join(),
        variables: {
            owner: owner,
            name: name
        }
    }
}

/**
 * The function processes a github graphql query.
 */
const processQuery = async (token: string, body: any) => {
    try {
        const data = {
            method: 'POST',
            headers: {
                authorization: `bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }

        const response = await fetch(GQL_URL, data)

        if (!response.ok) {
            console.log(response)
            return resultError<any>('Response is not 200!')
        }

        const json = await response.json()
        if (json.errors) {
            console.log(json)
            const errors = json.errors.map(
                (e: { message: string }) => e.message
            )
            return resultError<any>(errors.join(', '))
        }

        return resultSuccess<any>(json)
    } catch (e) {
        console.log('Error', e)
        return resultError<any>(`Error: ${e} `)
    }
}

export const ghGetListing = async (repoConfig: TRepoConfig, path: string) => {
    try {
        const body = getListingQuery(
            repoConfig.owner,
            repoConfig.name,
            'main',
            path
        )
        const result = await processQuery(repoConfig.token, body)
        if (result.hasError()) {
            return resultError<TListing[]>(result.getError())
        }
        return resultSuccess<TListing[]>(
            result.getValue().data.repository.object.entries as TListing[]
        )
    } catch (e) {
        return resultError<TListing[]>(`Error: ${e} `)
    }
}

// TODO: Order ? Return map with path as key?
export const ghGetFiles = async (repoConfig: TRepoConfig, paths: string[]) => {
    try {
        const body = filesQuery(
            repoConfig.owner,
            repoConfig.name,
            'main',
            paths
        )
        const result = await processQuery(repoConfig.token, body)
        if (result.hasError()) {
            return resultError<TFile[]>(result.getError())
        }

        const files: TFile[] = []

        for (const value of Object.values(result.getValue().data.repository)) {
            files.push(value as TFile)
        }

        return resultSuccess<TFile[]>(files)
    } catch (e) {
        console.log('Error', e)
        return resultError<TFile[]>(`Error: ${e} `)
    }
}

export const ghLastCommit = async (repoConfig: TRepoConfig) => {
    try {
        const body = lastCommitQuery(repoConfig.owner, repoConfig.name, 'main')
        const result = await processQuery(repoConfig.token, body)
        if (result.hasError()) {
            return resultError<string>(result.getError())
        }
        return resultSuccess<string>(
            result.getValue().data.repository.ref.target.history.nodes[0]
                .oid as string
        )
    } catch (e) {
        return resultError<string>(`Error: ${e} `)
    }
}

export const ghUpdateContent = async (repoConfig: TRepoConfig, oid: string) => {
    try {
        const body = updateContentQuery(
            repoConfig.owner,
            repoConfig.name,
            'main',
            oid,
            'collections/search-engine/test.txt',
            btoa('hallo at ' + new Date().toLocaleString())
        )
        const result = await processQuery(repoConfig.token, body)
        if (result.hasError()) {
            return resultError<string>(result.getError())
        }
        return resultSuccess<string>(
            result.getValue().data.repository.ref.target.history.nodes[0]
                .oid as string
        )
    } catch (e) {
        return resultError<string>(`Error: ${e} `)
    }
}
