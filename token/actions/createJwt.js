const promisify = require('functional-js/promises/promisify')
const sign      = promisify(require('jsonwebtoken').sign)
const _         = require('ramda/src/__')
const set       = require('ramda/src/set')
const lensProp  = require('ramda/src/lensProp')
const pathOr    = require('ramda/src/pathOr')
const uuid      = require('uuid/v4')
const pipeAsync = require('../lib/pipeAsync')

const reject = (logs, state) =>
    Promise.reject(set(lensProp('logs'), state.logs.concat(logs), state))

const generateTokens = state =>
    Promise.all([
        sign({ jti: uuid(), typ: 'Bearer', realm: state.props.realm, roles: pathOr([], ['user', 'roles'], state) },
             state.cert,
            { audience: state.props.client_id, subject: state.props.username, algorithm: 'RS256', expiresIn: process.env.TOKEN_EXPIRATION }),
        sign({ jti: uuid(), typ: 'ID', realm: state.props.realm, preferred_username: state.props.username },
             state.cert,
             { audience: state.props.client_id, subject: state.props.username, algorithm: 'RS256', expiresIn: process.env.TOKEN_EXPIRATION }),
        sign({ jti: uuid(), typ: 'Refresh', realm: state.props.realm },
             state.cert,
             { audience: state.props.client_id, subject: state.props.username, algorithm: 'RS256', expiresIn: process.env.REFRESH_TOKEN_EXPIRATION })
    ])
    .then(tokens => ({
        access_token: tokens[0],
        id_token: tokens[1],
        refresh_token: tokens[2]
    }))

const getCert = state =>
    state.actions.readFile(process.env.CERT, 'utf8')
        .then(set(lensProp('cert'), _, state))

const addTokensToState = state =>
    set(lensProp('token'), _, state)

const addDebugLogs = state =>
    set(lensProp('logs'), state.logs.concat({ type: 'debug', message: `tokens successfully created for ${state.props.realm}.${state.props.username}.` }), state)

const createJwt = state =>
    pipeAsync(
        getCert,
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
