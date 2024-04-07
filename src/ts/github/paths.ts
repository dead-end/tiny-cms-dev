import type { TRepoConfig } from '../types/repoConfig'

/**
 * The method creates the path for definitions.
 */
export const getDefinitionsPath = (config: TRepoConfig) => {
    const result = config.prefix ? config.prefix.concat('/') : ''
    return result.concat('definitions')
}

export const getDefinitionPath = (config: TRepoConfig, collection: string) => {
    return getDefinitionsPath(config).concat('/', collection, '.json')
}

/**
 * The method creates the path for a collection.
 */
export const getCollectionPath = (config: TRepoConfig, collection: string) => {
    const result = config.prefix ? config.prefix.concat('/') : ''
    return result.concat('collections', '/', collection)
}

/**
 * The method creates the path for an item in a collection.
 */
export const getItemPath = (
    config: TRepoConfig,
    collection: string,
    item: string
) => {
    return getCollectionPath(config, collection).concat('/', item, '.json')
}
