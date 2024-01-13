import { get, writable } from 'svelte/store'

/**
 * 
 */
export interface RepoConfig {
    owner: string,
    name: string,
    token: string,
}

/**
 * 
 */
const createRepoConfigStore = () => {

    const store = writable<RepoConfig>({
        owner: '',
        name: '',
        token: '',
    })

    return {
        subscribe: store.subscribe,

        login: (token: string) => {
            store.update((repoConfig) => {
                repoConfig.token = token;
                return repoConfig
            })
        },

        logout: () => {
            console.log("logout", get(store))
            store.update((repoConfig) => {
                repoConfig.token = '';
                return repoConfig
            })
        },

        isLogin: () => {
            console.log("login", get(store))
            return get(store).token !== ''
        }
    }
}

export const repoConfigStore = createRepoConfigStore()
