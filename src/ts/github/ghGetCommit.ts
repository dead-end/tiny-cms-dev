import Result from '../libs/result'
import type { TRepoConfig } from '../stores/repoConfig'
import { processQuery } from './github'

/**
 * The query gets the last commit
 */
const query = `
query getCommit($owner: String!, $name: String!, $branch: String!) {
  repository(owner: $owner, name: $name) {
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
const getBody = (repoConfig: TRepoConfig, query: string) => {
    return {
        query: query,
        variables: {
            owner: repoConfig.owner,
            name: repoConfig.name,
            branch: repoConfig.branch
        }
    }
}

const getCommit = (repository: any) => {
    return repository.ref.target.history.nodes[0].oid
}

/**
 * The function gets the last commit.
 */
export const ghGetCommit = async (repoConfig: TRepoConfig) => {
    const res = new Result<string>()

    try {
        const resultQuery = await processQuery(
            repoConfig.token,
            getBody(repoConfig, query)
        )
        if (resultQuery.hasError()) {
            return res.failed(resultQuery.getError())
        }

        const repository = resultQuery.getValue().data.repository

        return res.success(getCommit(repository))
    } catch (e) {
        return res.failed(`Error: ${e} `)
    }
}
