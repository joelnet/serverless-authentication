const promisify = require('functional-js/promises/promisify')
const sign      = promisify(require('jsonwebtoken').sign)
const pipeAsync = require('../lib/pipeAsync')

const reject = (logs, state) =>
    Promise.reject(Object.assign({}, state, { logs: (state.logs||[]).concat(logs) }))

const generateTokens = state =>
    Promise.all([
        sign({ realm: state.props.realm }, state.cert, { audience: state.props.client_id, subject: state.props.username, algorithm: 'RS256', expiresIn: process.env.TOKEN_EXPIRATION }),
        sign({ realm: state.props.realm }, state.cert, { audience: state.props.client_id, subject: state.props.username, algorithm: 'RS256', expiresIn: process.env.REFRESH_TOKEN_EXPIRATION })
    ])

const getCert = state =>
    state.actions.readFile(process.env.CERT, 'utf8')
        .then(cert => Object.assign({}, state, { cert }))

const addTokensToState = state => tokens =>
    Object.assign({}, state, { token: { id_token: tokens[0], refresh_token: tokens[1], token_type: 'Bearer' } })

const addDebugMessages = state =>
    Object.assign({}, state, { logs: (state.logs||[]).concat({ type: 'debug', message: `tokens successfully created for ${state.props.realm}.${state.props.username}.` }) })

const createJwt = state =>
    pipeAsync(
        getCert,
        generateTokens,
        addTokensToState(state),
        addDebugMessages
    )(state)

const handleException = func => state =>
    func(state)
        .catch(message => reject([
            { type: 'error', message: '[500] Internal Server Error' },
            { type: 'debug', message }
        ], state))

module.exports =
    handleException(createJwt)
