import Result from '../libs/result'
import type { TRepoConfig } from '../stores/repoConfig'
import { processQuery } from './github'

/**
 * The query deletes a file
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
    return data.createCommitOnBranch.commit.oid
}

/**
 * The function gets the last commit.
 */
export const ghDeleteFile = async (
    repoConfig: TRepoConfig,
    path: string,
    commit: string
) => {
    const res = new Result<string>()

    try {
        const resultQuery = await processQuery(
            repoConfig.token,
            getBody(repoConfig, path, commit)
        )
        if (resultQuery.hasError()) {
            return res.failed(resultQuery.getError())
        }
        return res.success(getCommit(resultQuery.getValue().data))
    } catch (e) {
        return res.failed(`Error: ${e} `)
    }
}
