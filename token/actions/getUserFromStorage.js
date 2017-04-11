const set       = require('ramda/src/set')
const lensProp  = require('ramda/src/lensProp')
const _         = require('ramda/src/__')

const UNKNOWN_ERROR = { type: 'error', message: '[500] Unknown Error' }

const appendLogs = (logs, state) =>
    set(lensProp('logs'), state.logs.concat(logs), state)

const getUser = state =>
    Promise.resolve(state)
        .then(state => state.actions.getUser(state.props.realm, state.props.username))
        .then(set(lensProp('user'), _, state))

const handleException = func => state =>
    func(state)
        .catch(message => Promise.reject(appendLogs([UNKNOWN_ERROR, { type: 'debug', message }], state)))

const failAndLogIfUserDoesNotExist = state =>
    state.user ? Promise.resolve(appendLogs([ { type: 'info', message: 'Login success fail' + ': ${state.props.username}.' } ], state))
               : Promise.reject(appendLogs([ { type: 'error', message: '[401] Unauthorized' } ], state))

module.exports = state =>
    handleException(getUser)(state)
        .then(failAndLogIfUserDoesNotExist)
