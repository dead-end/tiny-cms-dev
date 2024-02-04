import { resultError, resultSuccess } from './libs/result';
import type { TRepoConfig } from "./stores/repoConfig";

const GQL_URL = "https://api.github.com/graphql"

// TODO: Correct name ? Correct location?
export type TListing = {
    name: string;
    type: string;
    oid: string;
}

export type TFile = {
    text: string;
    oid: string;
}


// TODO: pagination
const getListingQuery = (owner: string, name: string, branch: string, path: string) => {
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
    const variables = {
        "owner": owner,
        "name": name,
        "path": `${branch}:${path}`
    }

    return { query, variables }
}

// TODO: Remove in the long run
const getFileQuery = (owner: string, name: string, branch: string, path: string) => {
    const query = `
    query getFile($owner: String!, $name: String!, $path: String!) {
        repository(owner: $owner, name: $name) {
          object(expression: $path) {
            ... on Blob {
              text
              oid
            }
          }
        }
      }
        `
    const variables = {
        "owner": owner,
        "name": name,
        "path": `${branch}:${path}`
    }

    return { query, variables }
}

const getFilesQuery = (owner: string, name: string, branch: string, paths: string[]) => {
    const arr: string[] = []

    arr.push(`
    query getFile($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
    `)

    let count = 0

    paths.forEach(path => {
        arr.push(`
        file${count++}: object(expression: "${branch}:${path}") {
            ... on Blob {
              text
              oid
            }
          }
        `)
    });

    arr.push(`
        }
    }
    `)

    const query = arr.join()

    const variables = {
        "owner": owner,
        "name": name,
    }

    return { query, variables }
}

const processQuery = async (token: string, body: any) => {

    try {

        const data = {
            method: 'POST',
            headers: {
                'authorization': `bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        }

        const response = await fetch(GQL_URL, data)

        if (!response.ok) {
            console.log(response)
            return resultError<any>('Response is not 200!')
        }

        const json = await response.json()
        console.log('processQuery:', json)
        return resultSuccess<any>(json)

    } catch (e) {
        console.log("Error", e)
        return resultError<any>(`Error: ${e} `)
    }
}

// TODO: Other file - separate grqaphql from files api
export const gqlGetFile = async (repoConfig: TRepoConfig, path: string) => {

    try {

        const body = getFileQuery(repoConfig.owner, repoConfig.name, 'main', path)
        const result = await processQuery(repoConfig.token, body)
        if (result.hasError()) {
            return resultError<TFile>(result.getError())
        }
        return resultSuccess<TFile>(result.getValue().data.repository.object as TFile)
    } catch (e) {
        console.log("Error", e)
        return resultError<TFile>(`Error: ${e} `)
    }
}

// TODO: Order ? Return map with path as key?
export const gqlGetFiles = async (repoConfig: TRepoConfig, paths: string[]) => {

    try {

        const body = getFilesQuery(repoConfig.owner, repoConfig.name, 'main', paths)
        const result = await processQuery(repoConfig.token, body)
        if (result.hasError()) {
            return resultError<TFile[]>(result.getError())
        }

        const files: TFile[] = []

        for (const value of Object.values(result.getValue().data.repository)) {
            files.push(value as TFile)
        }

        return resultSuccess<TFile[]>(files)
    } catch (e) {
        console.log("Error", e)
        return resultError<TFile>(`Error: ${e} `)
    }
}

export const gqlGetListing = async (repoConfig: TRepoConfig, path: string) => {

    try {
        const body = getListingQuery(repoConfig.owner, repoConfig.name, 'main', path)
        const result = await processQuery(repoConfig.token, body)
        if (result.hasError()) {
            return resultError<TListing[]>(result.getError())
        }
        return resultSuccess<TListing[]>(result.getValue().data.repository.object.entries as TListing[])
    } catch (e) {
        return resultError<TListing[]>(`Error: ${e} `)
    }
}