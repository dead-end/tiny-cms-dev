/**
 * The interface defines the result of a function call. In case of an error
 * this is the error message, otherwise the return value.
 */
export type Result<V> = {
    hasError: () => boolean
    getError: () => string
    getValue: () => V
}

/**
 * The funtion creates a result object in case of a success.
 */
export const resultSuccess = <V>(value: V): Result<V> => {
    return {
        hasError: () => false,
        getError: () => {
            throw new Error('Result has no error!')
        },
        getValue: () => value
    }
}

/**
 * The funtion creates a result object with an error message.
 */
export const resultError = <V>(error: string): Result<V> => {
    return {
        hasError: () => true,
        getError: () => error,
        getValue: () => {
            throw new Error('Result has no value!')
        }
    }
}
