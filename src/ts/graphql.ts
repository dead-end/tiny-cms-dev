import {
    ghLastCommitQuery,
    ghGetFilesQuery,
    ghGetListingQuery,
    ghProcessQuery,
    ghUpdateContent
} from './github/github'
import { resultError, resultSuccess } from './libs/result'
import type { TRepoConfig } from './stores/repoConfig'

const GQL_URL = 'https://api.github.com/graphql'

// TODO: Correct name ? Correct location?
export type TListing = {
    name: string
    type: string
    oid: string
}

export type TFile = {
    text: string
    oid: string
}

// TODO: Other file - separate grqaphql from files api
// TODO: use gqlGetFiles
export const gqlGetFile = async (repoConfig: TRepoConfig, path: string) => {
    try {
        const body = ghGetFilesQuery(
            repoConfig.owner,
            repoConfig.name,
            'main',
            [path]
        )
        const result = await ghProcessQuery(repoConfig.token, body)
        if (result.hasError()) {
            return resultError<TFile>(result.getError())
        }
        return resultSuccess<TFile>(
            result.getValue().data.repository.file0 as TFile
        )
    } catch (e) {
        console.log('Error', e)
        return resultError<TFile>(`Error: ${e} `)
    }
}

// TODO: Order ? Return map with path as key?
export const gqlGetFiles = async (repoConfig: TRepoConfig, paths: string[]) => {
    try {
        const body = ghGetFilesQuery(
            repoConfig.owner,
            repoConfig.name,
            'main',
            paths
        )
        const result = await ghProcessQuery(repoConfig.token, body)
        if (result.hasError()) {
            return resultError<TFile[]>(result.getError())
        }

        const files: TFile[] = []

        for (const value of Object.values(result.getValue().data.repository)) {
            files.push(value as TFile)
        }

        return resultSuccess<TFile[]>(files)
    } catch (e) {
        console.log('Error', e)
        return resultError<TFile[]>(`Error: ${e} `)
    }
}

export const gqlGetListing = async (repoConfig: TRepoConfig, path: string) => {
    try {
        const body = ghGetListingQuery(
            repoConfig.owner,
            repoConfig.name,
            'main',
            path
        )
        const result = await ghProcessQuery(repoConfig.token, body)
        if (result.hasError()) {
            return resultError<TListing[]>(result.getError())
        }
        return resultSuccess<TListing[]>(
            result.getValue().data.repository.object.entries as TListing[]
        )
    } catch (e) {
        return resultError<TListing[]>(`Error: ${e} `)
    }
}

export const gqlLastCommit = async (repoConfig: TRepoConfig) => {
    try {
        const body = ghLastCommitQuery(
            repoConfig.owner,
            repoConfig.name,
            'main'
        )
        const result = await ghProcessQuery(repoConfig.token, body)
        if (result.hasError()) {
            return resultError<string>(result.getError())
        }
        return resultSuccess<string>(
            result.getValue().data.repository.ref.target.history.nodes[0]
                .oid as string
        )
    } catch (e) {
        return resultError<string>(`Error: ${e} `)
    }
}

export const gqUpdateContent = async (repoConfig: TRepoConfig, oid: string) => {
    try {
        const body = ghUpdateContent(
            repoConfig.owner,
            repoConfig.name,
            'main',
            oid,
            'collections/search-engine/test.txt',
            btoa('hallo at ' + new Date().toLocaleString())
        )
        const result = await ghProcessQuery(repoConfig.token, body)
        if (result.hasError()) {
            return resultError<string>(result.getError())
        }
        return resultSuccess<string>(
            result.getValue().data.repository.ref.target.history.nodes[0]
                .oid as string
        )
    } catch (e) {
        return resultError<string>(`Error: ${e} `)
    }
}
