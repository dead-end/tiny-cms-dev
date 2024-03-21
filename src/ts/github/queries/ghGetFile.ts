import type { TRepoConfig } from '../../stores/repoConfig'
import type { TCheckFile, TCommit, TFile } from '../../types/files'
import { processGithubQuery } from './github'

/**
 * The query gets the oid of the file (which may not exist) and the commit id
 * of the branch.
 */
const queryWithoutCount = `
query getFile($owner: String!, $name: String!, $branch: String!, $exp: String!) {
    repository(owner: $owner, name: $name) {
      object(expression: $exp) {
        ... on Blob {
          oid
        }
      }
      ref(qualifiedName: $branch) {
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

/**
 * The same as queryWithoutCount with additional 'text'
 */
const queryWithCount = `
query getFile($owner: String!, $name: String!, $branch: String!, $exp: String!) {
    repository(owner: $owner, name: $name) {
      object(expression: $exp) {
        ... on Blob {
          text
          oid
        }
      }
      ref(qualifiedName: $branch) {
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
/**
 * Get the request body with the query and its variables.
 */
const getBody = (repoConfig: TRepoConfig, query: string, path: string) => {
    return {
        query: query,
        variables: {
            owner: repoConfig.owner,
            name: repoConfig.name,
            branch: repoConfig.branch,
            exp: `${repoConfig.branch}:${path}`
        }
    }
}

/**
 * The commit of the branch always exists.
 */
const getCommit = (repository: any) => {
    return repository.ref.target.history.nodes[0].oid as string
}

/**
 * The oid may not exist if the file does not exist.
 */
const getOid = (repository: any) => {
    if (repository.object === null) {
        return null
    }
    return repository.object.oid as string
}

const getText = (repository: any) => {
    return repository.object.text as string
}

/**
 * The function gets the oid and the commit for a file.
 */
export const ghCheckFile = async (repoConfig: TRepoConfig, path: string) => {
    const queryResult = await processGithubQuery(
        repoConfig.token,
        getBody(repoConfig, queryWithoutCount, path)
    )

    const repository = queryResult.data.repository

    const result: TCheckFile = {
        path: path,
        oid: getOid(repository),
        commit: getCommit(repository)
    }
    return result
}

/**
 * The function gets the oid, the commit and the content for a file.
 */
export const ghGetFile = async (repoConfig: TRepoConfig, path: string) => {
    const queryResult = await processGithubQuery(
        repoConfig.token,
        getBody(repoConfig, queryWithCount, path)
    )

    const repository = queryResult.data.repository

    const oid = getOid(repository)
    if (oid === null) {
        throw new Error(`File does not exist: ${path}`)
    }

    const result: TCommit<TFile> = {
        data: {
            path: path,
            oid: oid,
            text: getText(repository)
        },
        commit: getCommit(repository)
    }
    return result
}
