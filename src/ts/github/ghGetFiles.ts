import Result from '../libs/result'
import type { TRepoConfig } from '../stores/repoConfig'
import type { TFile } from '../types'
import { processQuery } from './github'

/**
 * The function returns a graphql query to get the content of files in a
 * directory.
 */
const filesQuery = (config: TRepoConfig, paths: string[]) => {
    const arr: string[] = []

    arr.push(`
    query getFile($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
    `)

    let count = 0

    paths.forEach((path) => {
        arr.push(`
        _${count++}: object(expression: "${config.branch}:${path}") {
            ... on Blob {
              text
              oid
            }
          }
        `)
    })

    arr.push(`
        }
    }
    `)

    return {
        query: arr.join(),
        variables: {
            owner: config.owner,
            name: config.name
        }
    }
}

/**
 * The function gets the content of a list of files.
 */
export const ghGetFiles = async (config: TRepoConfig, paths: string[]) => {
    const res = new Result<TFile[]>()
    try {
        const resultQuery = await processQuery(
            config.token,
            filesQuery(config, paths)
        )
        if (resultQuery.hasError()) {
            return res.failed(resultQuery.getError())
        }

        const repository = resultQuery.getValue().data.repository
        const files: TFile[] = []

        for (const [key, value] of Object.entries(repository)) {
            const path = paths[parseInt(key.substring(1))]
            const file = value as TFile
            file.path = path
            files.push(file)
        }

        if (paths.length !== files.length) {
            return res.failed(
                `Expected: ${paths.length} current: ${files.length}`
            )
        }

        return res.success(files)
    } catch (e) {
        console.log('Error', e)
        return res.failed(`Error: ${e} `)
    }
}
