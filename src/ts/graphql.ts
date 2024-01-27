import type { TRepoConfig } from "./stores/repoConfig";

const GQL_URL = "https://api.github.com/graphql"

export type TListing = {
    name: string;
    type: string;
}

const getFileQuery = (repoConfig: TRepoConfig, path: string) => {
    const query = `
    query getFile($owner: String!, $name: String!, $path: String!) {
        repository(owner: $owner, name: $name) {
          object(expression: $path) {
            ... on Blob {
              text
              byteSize
              oid
            }
          }
        }
      }
        `
    const variables = {
        "owner": repoConfig.owner,
        "name": repoConfig.name,
        "path": `HEAD:${path}`
    }

    return { query, variables }
}


const getListingQuery = (repoConfig: TRepoConfig, path: string) => {
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
        "owner": repoConfig.owner,
        "name": repoConfig.name,
        "path": `HEAD:${path}`
    }

    return { query, variables }
}

const processQuery = async (repoConfig: TRepoConfig, body: any) => {

    try {

        const data = {
            method: 'POST',
            headers: {
                'authorization': `bearer ${repoConfig.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        }

        const response = await fetch(GQL_URL, data)

        if (!response.ok) {
            console.log(response)
            return []
        }

        const json = await response.json()
        console.log('processQuery:', json)
        return json

    } catch (e) {
        console.log("Error", e)
    }
}

export const gqlGetFile = async (repoConfig: TRepoConfig, path: string) => {

    try {

        const body = getFileQuery(repoConfig, path)
        const json = await processQuery(repoConfig, body)
    } catch (e) {
        console.log("Error", e)
    }
}

export const gqlGetListing = async (repoConfig: TRepoConfig, path: string) => {

    try {

        const body = getListingQuery(repoConfig, path)
        const json = await processQuery(repoConfig, body)
        return json.data.repository.object.entries as TListing[]
    } catch (e) {
        console.log("Error", e)
        return []
    }
}