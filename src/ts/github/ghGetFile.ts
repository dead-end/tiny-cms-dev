import Result from '../libs/result'
import type { TRepoConfig } from '../stores/repoConfig'
import type { TCheckFile, TCommit, TFile } from '../types'
import { processQuery } from './github'

/**
 * The query gets the oid of the file and the commit id.
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

const getCommit = (repository: any) => {
    return repository.ref.target.history.nodes[0].oid
}

const getOid = (repository: any) => {
    return repository.object.oid
}

const getText = (repository: any) => {
    return repository.object.text
}

/**
 * The function gets the oid and the commit for a file.
 */
export const ghCheckFile = async (repoConfig: TRepoConfig, path: string) => {
    const res = new Result<TCheckFile>()
    try {
        const resultQuery = await processQuery(
            repoConfig.token,
            getBody(repoConfig, queryWithoutCount, path)
        )
        if (resultQuery.hasError()) {
            return res.failed(resultQuery.getError())
        }

        const repository = resultQuery.getValue().data.repository

        return res.success({
            path: path,
            oid: getOid(repository),
            commit: getCommit(repository)
        })
    } catch (e) {
        return res.failed(`Error: ${e} `)
    }
}

/**
 * The function gets the oid, the commit and the content for a file.
 */
export const ghGetFile = async (repoConfig: TRepoConfig, path: string) => {
    const res = new Result<TCommit<TFile>>()

    try {
        const resultQuery = await processQuery(
            repoConfig.token,
            getBody(repoConfig, queryWithCount, path)
        )
        if (resultQuery.hasError()) {
            return res.failed(resultQuery.getError())
        }

        const repository = resultQuery.getValue().data.repository

        return res.success({
            data: {
                path: path,
                oid: getOid(repository),
                text: getText(repository)
            },
            commit: getCommit(repository)
        })
    } catch (e) {
        return res.failed(`Error: ${e} `)
    }
}
