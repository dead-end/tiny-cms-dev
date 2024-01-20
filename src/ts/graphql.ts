import type { TRepoConfig } from "./stores/repoConfig";

const GQL_URL = "https://api.github.com/graphql"

export type TListing = {
    name: string;
    type: string;
}

export const gqlTest = async (repoConfig: TRepoConfig, path: string) => {

    try {
        const query = `
            query Listing($owner: String!, $name: String!) {
                repository(owner: $owner, name: $name) {
                object(expression: "HEAD:") {
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

        const data = {
            method: 'POST',
            headers: {
                'authorization': `bearer ${repoConfig.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "query": query,
                "variables": {
                    "owner": repoConfig.owner,
                    "name": repoConfig.name,
                    "path": path
                }
            }),
        }

        const response = await fetch(GQL_URL, data)

        if (!response.ok) {
            console.log(response)
            return []
        }

        const json = await response.json()

        console.log('githubGetHash:', json)
        return json.data.repository.object.entries as TListing[]
    } catch (e) {
        console.log("Error", e)
        return []
    }
}

