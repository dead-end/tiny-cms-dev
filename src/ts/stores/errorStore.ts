import { writable } from 'svelte/store'

/**
 * A simple store that contains error strings.
 */
export const errorStore = writable('')
