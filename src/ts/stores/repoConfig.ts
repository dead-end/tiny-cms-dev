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

        login: async (password: string) => {

            const data = localStorage.getItem("github-repo");
            if (!data) {
                throw new Error("Github repository data not found!");
            }

            let tmp = JSON.parse(data);
            const token = await dectyptToken(tmp.token, password);


            //const token = await dectyptToken(get(store).token, password)
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

            console.log("AFTER", get(store), "owner", owner)
        },

        loadRepoConfig: async (pwd: string) => {

            const data = localStorage.getItem("github-repo");
            if (!data) {
                throw new Error("Github repository data not found!");
            }

            let tmp = JSON.parse(data);
            tmp.token = await dectyptToken(tmp.token, pwd);

            store.set(tmp as RepoConfig)
        },

        initRepoConfig: () => {
            const data = localStorage.getItem("github-repo");
            if (!data) {
                return
            }

            let tmp = JSON.parse(data) as RepoConfig;

            store.set({
                owner: tmp.owner,
                name: tmp.name,
                token: ''
            })
        },

        hasRepoConfig: () => {
            return localStorage.getItem("github-repo") !== null
        }
    }
}

export const repoConfigStore = createRepoConfigStore()
