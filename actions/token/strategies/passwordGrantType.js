const promisify        = require('functional-js/promises/promisify')
const lensProp         = require('ramda/src/lensProp')
const pathEq           = require('ramda/src/pathEq')
const set              = require('ramda/src/set')
const validatePassword = promisify(require('bcrypt-nodejs').compare)
const pipeAsync        = require('../../../lib/pipeAsync')
const createJwt        = require('../../../lib/createJwt')
const getPrivateKey    = require('../../../lib/getKeys') .getPrivateKey
const thunk            = require('../../../lib/thunk')

const getUserOrReject = (getUser, realm, username) =>
    pipeAsync(
        _ => getUser(realm, username),
        user => user ? user : Promise.reject('User not found')
    )()

const getValidatedUser = (getUser, realm, username, password) =>
    pipeAsync(
        _ => getUserOrReject(getUser, realm, username),
        user => validatePassword(password, user.password)
            .then(valid => valid ? user : Promise.reject('Password does not match'))
    )()

module.exports.test =
    pathEq(['props', 'grant_type'], 'password')

module.exports.run = state =>
    pipeAsync(
        state => getValidatedUser(state.actions.getUser, state.props.realm, state.props.username, state.props.password),
        user  => set(lensProp('user'), user, state),
        state => createJwt(thunk(getPrivateKey, state.actions.readFile), state),
        token => set(lensProp('token'), token, state)
    )(state)
