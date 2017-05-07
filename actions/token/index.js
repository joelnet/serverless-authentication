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
    state.actions.writeLog(err.stack || err)

    return Promise.reject(exceptionMapper(err))
}

const getToken = pipeAsync(
    runTokenStrategy,
    state => state.actions.writeLogs(state),
    getRedirectOrToken
)

module.exports = validatedRequest((request, actions) => {
    const state = { props: request, actions, logs: [] }

    return getToken(state)
        .catch(handleException(state))
})
