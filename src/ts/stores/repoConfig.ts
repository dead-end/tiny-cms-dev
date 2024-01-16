import { get, writable } from 'svelte/store'
import { doEncrypt, doDecrypt, getIv, getKey, getSalt } from '../crypt'

/**
 * The definition of a repo config.
 */
export interface RepoConfig {
    owner: string,
    name: string,
    token: string,
}

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

/**
 * The function loads the repo config data from the local storage. If a password is
 * provided, then the token wil be decrypted. If not then the token will be set to
 * an empty string.
 */
const doLoadRepoConfig = async (password?: string) => {
    const data = localStorage.getItem("github-repo");
    if (!data) {
        throw new Error("Github repository data not found!");
    }

    let repoConfig = JSON.parse(data) as RepoConfig;
    repoConfig.token = password ? await dectyptToken(repoConfig.token, password) : '';
    return repoConfig
};

/**
 * The function saves the repo config to the local storage.
 */
const doSaveRepoConfig = async (repoConfig: RepoConfig, pwd: string) => {
    const data: RepoConfig = {
        owner: repoConfig.owner,
        name: repoConfig.name,
        token: await enctyptToken(repoConfig.token, pwd),
    };

    localStorage.setItem("github-repo", JSON.stringify(data));
    return repoConfig;
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

        initRepoConfig: async () => {
            store.set(await doLoadRepoConfig());
        },

        login: async (password: string) => {
            store.set(await doLoadRepoConfig(password));
        },

        logout: () => {
            console.log("logout", get(store))
            store.update((repoConfig) => {
                repoConfig.token = '';
                return repoConfig
            })
        },

        saveRepoConfig: async (repoConfig: RepoConfig, pwd: string) => {
            store.set(await doSaveRepoConfig(repoConfig, pwd))
        },
    }
}

export const repoConfigStore = createRepoConfigStore()
