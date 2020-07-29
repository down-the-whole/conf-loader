import fs from 'fs'
import path from 'path'

import deref from 'json-schema-deref-sync'
import minimist from 'minimist'

const argv = minimist(process.argv.slice(2))
const DEFAULT_DEPLOY_ENV = 'deploy-env'

export const getEnvironment = () => (
    argv.environment ||
    process.env.NODE_ENV ||
    'development'
)

export const getByName = (name: string, configFolderLocation: string) => {
    const environment = getEnvironment()

    const configuration = JSON.parse(
        fs.readFileSync(
            path.join(configFolderLocation, `${name}.json`),
            'utf8',
        ),
    )

    const schema = deref(configuration)

    if (
        environment === DEFAULT_DEPLOY_ENV &&
        !schema.hasOwnProperty(environment)
    ) {
        return schema[DEFAULT_DEPLOY_ENV]
    }

    return schema[environment]
}
