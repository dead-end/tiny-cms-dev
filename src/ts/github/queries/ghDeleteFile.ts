import type { TRepoConfig } from '../../types/repoConfig'
import { processGithubQuery } from './github'

/**
 * The query deletes a file.
 */
const query = `
mutation ($committableBranch: CommittableBranch!, $path: String!, $oid: GitObjectID!) {
  createCommitOnBranch(
    input: {
      branch: $committableBranch, 
      message: {
        headline: "Delete file"
      }, 
      fileChanges: {
        deletions: [
          {
            path: $path
          }
        ]
      }, 
      expectedHeadOid: $oid
    }
  ) {
    commit {
      oid
    }
  }
}   
`
/**
 * Get the request body with the query and its variables.
 */
const getBody = (repoConfig: TRepoConfig, path: string, oid: string) => {
    return {
        query,
        variables: {
            committableBranch: {
                repositoryNameWithOwner: `${repoConfig.owner}/${repoConfig.name}`,
                branchName: repoConfig.branch
            },
            path: path,
            oid: oid
        }
    }
}

const getCommit = (data: any) => {
    return data.createCommitOnBranch.commit.oid as string
}

/**
 * The function deletes a file.
 */
export const ghDeleteFile = async (
    repoConfig: TRepoConfig,
    path: string,
    commit: string
) => {
    const queryResult = await processGithubQuery(
        repoConfig.token,
        getBody(repoConfig, path, commit)
    )

    return getCommit(queryResult.data)
}
