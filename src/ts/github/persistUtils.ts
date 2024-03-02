import type { TRepoConfig } from '../stores/repoConfig'
import { ghGetCommit } from './queries/ghGetCommit'

/**
 * The function gets the last commit from the repository.
 */
export const getLastCommit = async (config: TRepoConfig) => {
    return ghGetCommit(config)
}
