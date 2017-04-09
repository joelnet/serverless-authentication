const UNKNOWN_ERROR = { type: 'error', message: '[500] Unknown Error' }

const appendLogs = (state, logs) =>
    Object.assign({}, state, { logs: state.logs.concat(logs) })

const reject = (logs, state) =>
    Promise.reject(Object.assign({}, state, { logs: (state.logs||[]).concat(logs) }))

const getUser = state =>
    Promise.resolve(state)
        .then(state => state.actions.getUser(state.props.realm, state.props.username))
        .then(user => Object.assign({}, state, { user }))

const handleException = func => state =>
    func(state)
        .catch(message => reject([UNKNOWN_ERROR, { type: 'debug', message }], state))

const failAndLogIfUserDoesNotExist = state =>
    state.user ? Promise.resolve(appendLogs(state, [ { type: 'info', message: 'Login success fail' + ': ${state.props.username}.' } ]))
               : Promise.reject(appendLogs(state, [ { type: 'error', message: '[401] Unauthorized' } ]))

module.exports = state =>
    handleException(getUser)(state)
        .then(failAndLogIfUserDoesNotExist)
