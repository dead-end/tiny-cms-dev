import { writable } from 'svelte/store'
import { encrypt, decrypt } from '../libs/crypt'

/**
 * The definition of a repo config.
 */
export type TRepoConfig = {
    owner: string
    name: string
    token: string
}

const defaultRepoConfig: TRepoConfig = {
    owner: '',
    name: '',
    token: ''
}

const KEY = 'github-repo'

/**
 * The function loads the repo config data from the local storage. If a password is
 * provided, then the token wil be decrypted. If not then the token will be set to
 * an empty string.
 */
const doLoadRepoConfig = async (password?: string) => {
    const data = localStorage.getItem(KEY)
    if (!data) {
        if (password) {
            throw new Error('Github repository data not found!')
        }

        return defaultRepoConfig
    }

    let repoConfig = JSON.parse(data) as TRepoConfig
    repoConfig.token = password ? await decrypt(repoConfig.token, password) : ''
    return repoConfig
}

/**
 * The function saves the repo config to the local storage.
 */
const doSaveRepoConfig = async (repoConfig: TRepoConfig, password: string) => {
    const data: TRepoConfig = {
        owner: repoConfig.owner,
        name: repoConfig.name,
        token: await encrypt(repoConfig.token, password)
    }

    localStorage.setItem(KEY, JSON.stringify(data))
    return repoConfig
}

/**
 * Delete the repo config data to reset.
 */
const doReset = () => {
    localStorage.removeItem(KEY)
}

/**
 * The function creates the repo config store.
 */
const createRepoConfigStore = () => {
    const store = writable<TRepoConfig>(defaultRepoConfig)

    return {
        subscribe: store.subscribe,

        initRepoConfig: async () => {
            store.set(await doLoadRepoConfig())
        },

        login: async (password: string) => {
            store.set(await doLoadRepoConfig(password))
        },

        logout: () => {
            store.update((repoConfig) => {
                repoConfig.token = ''
                return repoConfig
            })
        },

        saveRepoConfig: async (repoConfig: TRepoConfig, pwd: string) => {
            repoConfig = await doSaveRepoConfig(repoConfig, pwd)
            store.set(repoConfig)
        },

        reset: () => {
            doReset()
            store.set(defaultRepoConfig)
        }
    }
}

export const repoConfigStore = createRepoConfigStore()
