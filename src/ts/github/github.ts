import { resultError, resultSuccess } from '../libs/result';

const GQL_URL = "https://api.github.com/graphql"

// TODO: pagination
export const ghGetListingQuery = (owner: string, name: string, branch: string, path: string) => {
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
        'owner': owner,
        'name': name,
        'path': `${branch}:${path}`
    }

    return { query, variables }
}

/**
 * The function returns a graphql query to get the content of files in a
 * directory.
 */
export const ghGetFilesQuery = (owner: string, name: string, branch: string, paths: string[]) => {
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

    return {
        query: arr.join(),
        variables: {
            'owner': owner,
            'name': name,
        }
    }
}

/**
 * The function processes a github graphql query.
 */
export const ghProcessQuery = async (token: string, body: any) => {
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
        if (json.errors) {
            console.log(json)
            const errors = json.errors.map((e: { message: string }) => e.message)
            return resultError<any>(errors.join(', '))
        }

        return resultSuccess<any>(json)

    } catch (e) {
        console.log('Error', e)
        return resultError<any>(`Error: ${e} `)
    }
}
