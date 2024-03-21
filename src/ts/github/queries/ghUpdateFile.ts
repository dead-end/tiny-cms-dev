import type { TRepoConfig } from '../../stores/repoConfig'
import type { TCommit, TFile } from '../../types/files'
import type { TEntry } from '../../types/entries'
import { processGithubQuery } from './github'

/*
 * The query updates the content of a file.
 */
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
            oid
            file (path:$path) {
              oid
            }
        }
    }
}
`

/**
 * Get the request body with the query and its variables.
 */
const getBody = (
    repoConfig: TRepoConfig,
    path: string,
    oid: string,
    content: string
) => {
    return {
        query,
        variables: {
            committableBranch: {
                repositoryNameWithOwner: `${repoConfig.owner}/${repoConfig.name}`,
                branchName: repoConfig.branch
            },
            path: path,
            content: content,
            oid: oid
        }
    }
}

const getCommit = (data: any) => {
    return data.createCommitOnBranch.commit.oid as string
}

const getOid = (data: any) => {
    return data.createCommitOnBranch.commit.file.oid as string
}

/**
 * The function updates the content of a file.
 */
export const ghUpdateContent = async (
    repoConfig: TRepoConfig,
    path: string,
    commit: string,
    entry: TEntry
) => {
    entry.tc_modified = new Date().getTime()
    const content = JSON.stringify(entry)

    const queryResult = await processGithubQuery(
        repoConfig.token,
        getBody(repoConfig, path, commit, btoa(content))
    )

    const result: TCommit<TFile> = {
        commit: getCommit(queryResult.data),
        data: {
            path: path,
            oid: getOid(queryResult.data),
            text: content
        }
    }
    return result
}
