const config        = require('config')
const promisify     = require('functional-js/promises/promisify')
const sign          = promisify(require('jsonwebtoken').sign)
const _             = require('ramda/src/__')
const set           = require('ramda/src/set')
const lensProp      = require('ramda/src/lensProp')
const pathOr        = require('ramda/src/pathOr')
const uuid          = require('uuid/v4')
const pipeAsync     = require('../lib/pipeAsync')
const getPrivateKey = require('../lib/getKeys') .getPrivateKey

const reject = (logs, state) =>
    Promise.reject(set(lensProp('logs'), state.logs.concat(logs), state))

const generateTokensWithCert = state => cert =>
    Promise.all([
        sign({ jti: uuid(), typ: 'Bearer', realm: state.props.realm, roles: pathOr([], ['user', 'roles'], state) },
             cert,
            { audience: state.props.client_id, subject: state.props.username, algorithm: 'RS256', expiresIn: config.get('token.tokenExpiration') }),
        sign({ jti: uuid(), typ: 'ID', realm: state.props.realm, preferred_username: state.props.username },
             cert,
             { audience: state.props.client_id, subject: state.props.username, algorithm: 'RS256', expiresIn: config.get('token.tokenExpiration') }),
        sign({ jti: uuid(), typ: 'Refresh', realm: state.props.realm },
             cert,
             { audience: state.props.client_id, subject: state.props.username, algorithm: 'RS256', expiresIn: config.get('token.refreshTokenExpiration') })
    ])
    .then(tokens => ({
        access_token: tokens[0],
        id_token: tokens[1],
        refresh_token: tokens[2]
    }))

const addTokensToState = state =>
    set(lensProp('token'), _, state)

const addDebugLogs = state =>
    set(lensProp('logs'), state.logs.concat({ type: 'debug', message: `tokens successfully created for ${state.props.realm}.${state.props.username}.` }), state)

const generateTokens = state =>
    getPrivateKey(state.actions.readFile)
        .then(generateTokensWithCert(state))

const createJwt = state =>
    pipeAsync(
        generateTokens,
        addTokensToState(state),
        addDebugLogs
    )(state)

const handleException = func => state =>
    func(state)
        .catch(message => reject([
            { type: 'error', message: '[500] Internal Server Error' },
            { type: 'debug', message }
        ], state))

module.exports =
    handleException(createJwt)
