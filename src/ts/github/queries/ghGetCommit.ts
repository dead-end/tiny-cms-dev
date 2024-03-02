import type { TRepoConfig } from '../../stores/repoConfig'
import { processGithubQuery } from './github'

/**
 * The query gets the last commit.
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
    return repository.ref.target.history.nodes[0].oid as string
}

/**
 * The function gets the last commit.
 */
export const ghGetCommit = async (repoConfig: TRepoConfig) => {
    const queryResult = await processGithubQuery(
        repoConfig.token,
        getBody(repoConfig, query)
    )

    return getCommit(queryResult.data.repository)
}
