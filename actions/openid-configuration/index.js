const validatedRequest = require('./request')
const exceptionMapper = require('../../lib/exceptionMapper')
const pipeAsync = require('../../lib/pipeAsync')

const handleException = state => err => {
    state.actions.log.error(err.stack || err)

    return Promise.reject(exceptionMapper(err))
}

const getOpenidConfiguration = pipeAsync(
    state => state.actions.getRealm(state.props.realm),
    realm => realm ? realm.configuration : Promise.reject('Not Found')
)

module.exports = validatedRequest((props, actions) => {
    const state = { props, actions }

    return getOpenidConfiguration(state)
        .catch(handleException(state))
})
