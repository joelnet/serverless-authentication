const promisify        = require('functional-js/promises/promisify')
const sign             = promisify(require('jsonwebtoken').sign)
const validatePassword = promisify(require('bcrypt-nodejs').compare)
const pipeAsync        = require('../../lib/pipeAsync')
const get              = require('../../lib/get')

const generateTokens = props => cert =>
    Promise.all([
        sign({ realm: props.realm }, cert, { audience: props.client_id, subject: props.username, algorithm: 'RS256', expiresIn: process.env.TOKEN_EXPIRATION }),
        sign({ realm: props.realm }, cert, { audience: props.client_id, subject: props.username, algorithm: 'RS256', expiresIn: process.env.REFRESH_TOKEN_EXPIRATION })
    ])

const getCert = req =>
    req.actions.readFile(process.env.CERT, 'utf8')

const appendLogs = (state, logs) =>
    Object.assign({}, state, { logs: state.logs.concat(logs) })

module.exports = {
    createJwt: state =>
        pipeAsync(
            getCert,
            generateTokens(state.props),
            tokens => Object.assign({}, state, { token: { id_token: tokens[0], refresh_token: tokens[1], token_type: 'Bearer' } }),
            state => Object.assign({}, state, { logs: state.logs.concat({ type: 'debug', message: `tokens successfully created for ${state.props.realm}.${state.props.username}.` }) })
        )(state)
        .catch(err => Promise.reject(appendLogs(state, [
            { type: 'error', message: '[500] Error generating tokens.' },
            { type: 'debug', message: err }
        ]))),

    getUserFromStorage: state =>
        Promise.resolve(state)
            .then(state => state.actions.getUser(state.props.realm, state.props.username))
            .catch(err => Promise.reject(appendLogs(state, [
                { type: 'error', message: '[500] Unknown Error' },
                { type: 'debug', message: err }
            ])))
            .then(user => Object.assign({}, state, { user }))
            .then(state =>
                state.user ? Promise.resolve(appendLogs(state, [ { type: 'info', message: 'Login success fail' + ': ${state.props.username}.' } ]))
                           : Promise.reject(appendLogs(state, [ { type: 'error', message: '[401] Unauthorized' } ]))),

    validateUser: state =>
        Promise.resolve(state.user ? state : Promise.reject('[401] Login Failed'))
            .then(state => validatePassword(state.props.password, state.user.password))
            .then(isValid => isValid ? state : Promise.reject('[401] Login Failed'))
}
