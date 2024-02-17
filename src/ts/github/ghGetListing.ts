import Result from '../libs/result'
import type { TRepoConfig } from '../stores/repoConfig'
import type { TListing } from '../types'
import { processQuery } from './github'

/**
 * The query gets the directory listing of a path. It contains the type but not
 * the content of a file.
 */
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
/**
 * Get the request body with the query and its variables.
 */
const getBody = (config: TRepoConfig, path: string) => {
    return {
        query,
        variables: {
            owner: config.owner,
            name: config.name,
            path: `${config.branch}:${path}`
        }
    }
}

/**
 * The function gets the files from a directory, without their contents.
 */
export const ghGetListing = async (config: TRepoConfig, path: string) => {
    const res = new Result<TListing[]>()
    try {
        const resultQuery = await processQuery(
            config.token,
            getBody(config, path)
        )
        if (resultQuery.hasError()) {
            return res.failed(resultQuery.getError())
        }
        return res.success(
            resultQuery.getValue().data.repository.object.entries as TListing[]
        )
    } catch (e) {
        return res.failed(`Error: ${e} `)
    }
}
