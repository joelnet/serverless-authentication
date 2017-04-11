const promisify        = require('functional-js/promises/promisify')
const validatePassword = promisify(require('bcrypt-nodejs').compare)
const set              = require('ramda/src/set')
const lensProp         = require('ramda/src/lensProp')
const _                = require('ramda/src/__')
const pipeAsync        = require('../lib/pipeAsync')

const UNAUTHORIZED = { type: 'error', message: '[401] Unauthorized' }

const reject = (logs, state) =>
    Promise.reject(set(lensProp('logs'), state.logs.concat(logs), state))

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
