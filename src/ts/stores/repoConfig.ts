import { get, writable } from 'svelte/store'
import { doEncrypt, doDecrypt, getIv, getKey, getSalt } from '../crypt'

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

    /**
 * The function encryptes the token.
 */
    const enctyptToken = async (token: string, pwd: string) => {
        const key = await getKey(pwd, getSalt());
        return await doEncrypt(key, getIv(), token);
    };

    /**
     * The function decryptes the token.
     */
    const dectyptToken = async (base64: string, pwd: string) => {
        const key = await getKey(pwd, getSalt());
        return await doDecrypt(key, getIv(), base64);
    };

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
        },

        saveRepoConfig: async (owner: string,
            name: string,
            token: string,
            pwd: string) => {

            const base64 = await enctyptToken(token, pwd);

            const data: RepoConfig = {
                owner,
                name,
                token: base64,
            };

            localStorage.setItem("github-repo", JSON.stringify(data));

            store.set({
                owner, name, token
            })
        },

        loadRepoConfig: async (pwd: string) => {

            const data = localStorage.getItem("github-repo");
            if (!data) {
                throw new Error("Github repository data not found!");
            }

            let tmp = JSON.parse(data);
            tmp.token = await dectyptToken(tmp.token, pwd);

            store.set(tmp as RepoConfig)
        }
    }
}

export const repoConfigStore = createRepoConfigStore()
