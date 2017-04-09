const promisify        = require('functional-js/promises/promisify')
const validatePassword = promisify(require('bcrypt-nodejs').compare)
const pipeAsync        = require('../lib/pipeAsync')

const UNAUTHORIZED = { type: 'error', message: '[401] Unauthorized' }

const reject = (logs, state) =>
    Promise.reject(Object.assign({}, state, { logs: (state.logs||[]).concat(logs) }))

const rejectIfNoUser = message => state =>
    state && state.user ? state : reject(message, state)

const rejectIfPasswordInvalid = message => state =>
    validatePassword(state.props.password, state.user.password)
        .then(isValid => isValid ? state : reject(message, state))

const handleException = func => state =>
    func(state)
        .catch(message => reject([UNAUTHORIZED, { type: 'error', message }], state))

module.exports =
    handleException(pipeAsync(
        rejectIfNoUser(UNAUTHORIZED),
        rejectIfPasswordInvalid(UNAUTHORIZED)
    ))
