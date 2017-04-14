const promisify     = require('functional-js/promises/promisify')
const lensProp      = require('ramda/src/lensProp')
const propOr        = require('ramda/src/propOr')
const set           = require('ramda/src/set')
const jwtVerify     = promisify(require('jsonwebtoken').verify)
const getPublicKey = require('../lib/getKeys').getPublicKey

const BAD_REQUEST   = { type: 'error', message: '[400] Bad Request' }
const UNKNOWN_ERROR = { type: 'error', message: '[500] Unknown Error' }

const getErrorType = message =>
    (''+message).substr(0, 6) === 'Error:'
        ? UNKNOWN_ERROR
        : BAD_REQUEST

const rejectIfTypIsNotRefresh = token =>
    token.typ === 'Refresh'
        ? token
        : Promise.reject('JsonWebTokenError: typ is invalid. expected Refresh.')

const reject = state => message => {
    const logs = propOr([], 'logs', state)
        .concat([
            getErrorType(message),
            { type: 'debug', message: ''+ message }
        ])

    return Promise.reject(set(lensProp('logs'), logs, state))
}

module.exports = (state) =>
    Promise.resolve(state)
        .then(state => getPublicKey(state.actions.readFile))
        .then(cert => jwtVerify(state.props.refresh_token, cert, { algorithms: ['RS256'] }))
        .then(rejectIfTypIsNotRefresh)
        .then(token => set(lensProp('user'), { username: token.sub, client_id: token.aud, realm: token.realm }, state))
        .catch(reject(state))
