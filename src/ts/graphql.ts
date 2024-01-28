import type { TRepoConfig } from "./stores/repoConfig";

const GQL_URL = "https://api.github.com/graphql"

export type TListing = {
    name: string;
    type: string;
    oid: string;
}

export type TFile = {
    text: string;
    oid: string;
}

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

        const body = getFileQuery(repoConfig.owner, repoConfig.name, 'main', path)
        const json = await processQuery(repoConfig.token, body)
        return json.data.repository.object as TFile
    } catch (e) {
        console.log("Error", e)
    }
}

export const gqlGetListing = async (repoConfig: TRepoConfig, path: string) => {

    try {

        const body = getListingQuery(repoConfig.owner, repoConfig.name, 'main', path)
        const json = await processQuery(repoConfig.token, body)
        return json.data.repository.object.entries as TListing[]
    } catch (e) {
        console.log("Error", e)
        return []
    }
}