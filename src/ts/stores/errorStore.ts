import { writable } from 'svelte/store'

/**
 * The function creates a store object for errors. The errors are maintained in
 * an array.
 */
const createErrorStore = () => {
    //
    // Initialize the store with an empty array.
    //
    const { subscribe, set, update } = writable([] as string[])

    return {
        subscribe,

        /**
         * Add a new error to the error array.
         */
        addError: (error: string) => {
            update((errors) => {
                errors.push(error)
                return errors
            })
        },

        /**
         * Reset the store with an empty array.
         */
        resetErrors: () => {
            console.log('reset')
            set([])
        }
    }
}

export const errorStore = createErrorStore()
