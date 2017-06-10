const promisify = require('functional-js/promises/promisify')
const hash = promisify(require('bcrypt-nodejs').hash)
const dissoc = require('ramda/src/dissoc')
const set = require('ramda/src/set')
const lensPath = require('ramda/src/lensPath')
const validatedRequest = require('./request')
const exceptionMapper = require('../../lib/exceptionMapper')

const toUserModel = (state) => ({
    userId: `${state.props.realm}:${state.props.username}`,
    emailAddress: state.props.username,
    password: state.props.password,
    realm: state.props.realm,
    roles: [],
})

const ensureRealmExists = state =>
    state.actions.getRealm(state.props.realm)
        .then(realm => realm ? Promise.resolve(state) : Promise.reject('Realm not found'))

const hashPassword = state =>
    hash(state.props.password, null, null)
        .then(hash => set(lensPath(['props', 'password']), hash, state))

const handleException = state => err =>
    Promise.resolve()
        .then(() => state.actions.log.error(err.stack || err))
        .then(() => Promise.reject(exceptionMapper(err)))
        .catch(err => (
            state.actions.log.debug('Response:', err),
            Promise.reject(err)
        ))

module.exports = validatedRequest((request, actions) => {
    const state = { props: request, actions }

    actions.log.debug('Starting user-registration')

    return Promise.resolve(state)
        .then(ensureRealmExists)
        .then(hashPassword)
        .then(state => state.actions.createUser(toUserModel(state)))
        .then(user => state.actions.log.info('User created', JSON.stringify(dissoc('password', user))))
        .then(() => (
            state.actions.log.debug('Response:', { statusCode: 201 }),
            { statusCode: 201 }
        ))
        .catch(handleException(state))
})
