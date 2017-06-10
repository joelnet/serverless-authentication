const prop = require('ramda/src/prop')
const pipeAsync = require('../../lib/pipeAsync')
const exceptionMapper = require('../../lib/exceptionMapper')
const redirectResponse = require('../../lib/serviceHelpers').redirectResponse
const validatedRequest = require('./request')
const strategies = require('./strategies')

const runTokenStrategy = state =>
    strategies
        .find(o => o.test(state))
        .run(state)

const getRedirectOrToken = state =>
    state.props.redirect_uri
        ? redirectResponse(state.props.redirect_uri)
        : prop('token', state)

const handleException = state => err => {
    state.actions.log.error(err.stack || err)

    return Promise.reject(exceptionMapper(err))
}

const getToken = pipeAsync(
    runTokenStrategy,
    state => (
        state.actions.log.info(state), // TODO: convert this to a TAP
        state
    ),
    getRedirectOrToken
)

module.exports = validatedRequest((request, actions) => {
    const state = { props: request, actions, logs: [] }

    return getToken(state)
        .catch(handleException(state))
})
