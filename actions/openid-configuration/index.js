const config = require('config')
const validatedRequest = require('./request')
const exceptionMapper = require('../../lib/exceptionMapper')
const pipeAsync = require('../../lib/pipeAsync')

const rootUri = config.get('authorizationEndpoint')

const getConfiguration = realm => ({
    issuer: `${rootUri}/${realm}/oidc`,
    authorization_endpoint: `${rootUri}/${realm}/oidc/authorize`,
    token_endpoint: `${rootUri}/${realm}/oidc/token`,
    registration_endpoint: `${rootUri}/${realm}/registration`,
    jwks_uri: 'about:blank',
    id_token_signing_alg_values_supported: ['RS256'],
    response_types_supported: ['code', 'id_token'],
    subject_types_supported: ['public'],
})

const handleException = state => err => {
    state.actions.log.error(err.stack || err)

    return Promise.reject(exceptionMapper(err))
}

const getOpenidConfiguration = pipeAsync(
    state => state.actions.getRealm(state.props.realm),
    realm => realm ? getConfiguration(realm.realmId) : Promise.reject('Not Found')
)

module.exports = validatedRequest((props, actions) => {
    const state = { props, actions }

    return getOpenidConfiguration(state)
        .catch(handleException(state))
})
