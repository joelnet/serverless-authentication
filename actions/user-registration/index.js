const promisify = require('functional-js/promises/promisify')
const hashPassword = promisify(require('bcrypt-nodejs').hash)
const validatedRequest = require('./request')
const exceptionMapper = require('../../lib/exceptionMapper')

const getUser = (state) => ({
    userId: `${state.props.realm}:${state.props.username}`,
    emailAddress: state.props.username,
    password: state.props.password,
    realm: state.props.realm,
    roles: [],
})

const setHashedPassword = obj => hash => {
    const props = { props: Object.assign({}, obj.props, { password: hash }) }
    return Object.assign({}, obj, props)
}

const ensureRealmExists = state =>
    state.actions.getRealm(state.props.realm)
        .then(realm => realm ? Promise.resolve(state) : Promise.reject('Realm not found'))

const handleException = state => err => {
    state.actions.writeLog(err.stack || err)

    return Promise.reject(exceptionMapper(err))
}

module.exports = validatedRequest((request, actions) => {
    const state = { props: request, actions }

    return Promise.resolve(state)
        .then(ensureRealmExists)
        .then(state =>
            hashPassword(state.props.password, null, null)
                .then(setHashedPassword(state))
        )
        .then(state => state.actions.createUser(getUser(state)))
        .then(() => ({ statusCode: 201 }))
        .catch(handleException(state))
})
