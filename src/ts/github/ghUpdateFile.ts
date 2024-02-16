import Result from '../libs/result'
import type { TRepoConfig } from '../stores/repoConfig'
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
            commitUrl
        }
    }
}
`

const getBody = (
    repoConfig: TRepoConfig,
    path: string,
    oid: string,
    content: string
) => {
    const variables = {
        committableBranch: {
            repositoryNameWithOwner: `${repoConfig.owner}/${repoConfig.name}`,
            branchName: repoConfig.branch
        },
        path: path,
        content: content,
        oid: oid
    }

    return { query, variables }
}

export const ghUpdateContent = async (
    repoConfig: TRepoConfig,
    path: string,
    commit: string,
    content: string
) => {
    const res = new Result<string>()
    try {
        const result = await processQuery(
            repoConfig.token,
            getBody(repoConfig, path, commit, btoa(content))
        )

        if (result.hasError()) {
            return res.failed(result.getError())
        }

        console.log('result.getValue()', result.getValue())

        return res.success(
            result.getValue().data.repository.ref.target.history.nodes[0]
                .oid as string
        )
    } catch (e) {
        return res.failed(`Error: ${e} `)
    }
}
