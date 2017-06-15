const config = require('config')
const promisify = require('functional-helpers/promisify')
const jwtVerify = promisify(require('jsonwebtoken').verify)
const validatedRequest = require('./request')
const getPublicKey = require('../../lib/getKeys').getPublicKey
const exceptionMapper = require('../../lib/exceptionMapper')

const rejectIfRealmInvalid = jwt =>
    jwt.realm === config.get('realm') ? jwt : Promise.reject('Not Authorized')

const rejectIfUserDoesntOwnRealm = realm => jwt =>
    realm.substr(0, jwt.sub.length + 1) === `${jwt.sub}:` ? jwt : Promise.reject('Not Authorized')

const handleException = state => err => {
    state.actions.log.error(err.stack || err)

    return Promise.reject(exceptionMapper(err))
}

module.exports = validatedRequest((request, actions) => {
    const state = { props: request, actions }

    actions.log.debug('Starting create-realm')

    return Promise.resolve(state)
        .then(state => getPublicKey(state.actions.readFile))
        .then(cert => jwtVerify(state.props.access_token, cert, { algorithms: ['RS256'] }))
        .then(rejectIfRealmInvalid)
        .then(rejectIfUserDoesntOwnRealm(state.props.realm))
        .then(jwt => state.actions.createRealm({ realmId: state.props.realm, owner: jwt.sub }))
        .catch(handleException(state))
})
