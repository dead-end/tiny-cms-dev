import Result from '../libs/result'

const GQL_URL = 'https://api.github.com/graphql'

/**
 * The function processes a github graphql query.
 */
export const processQuery = async (token: string, body: any) => {
    const res = new Result<any>()
    try {
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
            console.log(response)
            return res.failed('Response is not 200!')
        }

        const json = await response.json()
        if (json.errors) {
            console.log(json)
            const errors = json.errors.map(
                (e: { message: string }) => e.message
            )
            return res.failed(errors.join(', '))
        }

        return res.success(json)
    } catch (e) {
        console.log('Error', e)
        return res.failed(`Unable to process query: ${e} `)
    }
}
