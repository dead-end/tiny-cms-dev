import Result from '../libs/result'
import type { TRepoConfig } from '../stores/repoConfig'
import type { TCommit, TEntry, TFile } from '../types'
import { processQuery } from './github'

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

export const ghUpdateContent = async (
    repoConfig: TRepoConfig,
    path: string,
    commit: string,
    entry: TEntry
) => {
    const res = new Result<TCommit<TFile>>()
    try {
        entry.modified = new Date().getTime()
        const content = JSON.stringify(entry)
        const result = await processQuery(
            repoConfig.token,
            getBody(repoConfig, path, commit, btoa(content))
        )

        if (result.hasError()) {
            return res.failed(result.getError())
        }

        console.log('result.getValue()', result.getValue())

        const data = result.getValue().data

        return res.success({
            commit: getCommit(data),
            data: {
                path: path,
                oid: getOid(data),
                text: content
            }
        })
    } catch (e) {
        return res.failed(`Error: ${e} `)
    }
}
