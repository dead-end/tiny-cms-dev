const GQL_URL = 'https://api.github.com/graphql'

/**
 * The function processes a github graphql query.
 */
export const processGithubQuery = async (token: string, body: any) => {
    const data = {
        method: 'POST',
        headers: {
            authorization: `bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }

    const response = await fetch(GQL_URL, data)

    if (!response.ok) {
        throw new Error(`Response: ${response.status} - ${response.statusText}`)
    }

    const json = await response.json()
    if (json.errors) {
        const errors = json.errors.map((e: { message: string }) => e.message)
        throw new Error(errors.join(', '))
    }

    return json
}
