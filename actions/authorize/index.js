const status = require('http-status')
const set = require('ramda/src/set')
const lensProp = require('ramda/src/lensProp')
const validatedRequest = require('./request')
const pipeAsync = require('../../lib/pipeAsync')
const appendQuery = require('../../lib/urlHelper').appendQuery

const redirect = uri => ({
    statusCode: status.FOUND,
    headers: { Location: uri },
    body: ''
})

const handleException = state => err => {
    const response = redirect(appendQuery(state.props.redirect_uri, { error: 'Internal Server Error' }))
    state.actions.log.error(err.stack || err)
    state.actions.log.debug('Response:', response)
    return response
}

const getAuthorization = pipeAsync(
    state =>
        state.actions.getRealm(state.props.realm)
            .then(realm => set(lensProp('realm'), realm, state)),
    ({ props, realm }) =>
        realm
            ? redirect(appendQuery(realm.auth_uri, { state: props.state, redirect_uri: props.redirect_uri }))
            : redirect(appendQuery(props.redirect_uri, { error: 'realm not found' }))
)

module.exports = validatedRequest((request, actions) => {
    const state = { props: request, actions }

    actions.log.debug('Starting oidc/authorize')

    return getAuthorization(state)
        .catch(handleException(state))
})
