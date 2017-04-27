const lensProp      = require('ramda/src/lensProp')
const merge         = require('ramda/src/merge')
const pathEq        = require('ramda/src/pathEq')
const set           = require('ramda/src/set')
const promisify     = require('functional-js/promises/promisify')
const jwtVerify     = promisify(require('jsonwebtoken').verify)
const pipeAsync     = require('../../../lib/pipeAsync')
const getPublicKey  = require('../../../lib/getKeys').getPublicKey
const createJwt     = require('../../../lib/createJwt')
const getPrivateKey = require('../../../lib/getKeys') .getPrivateKey
const thunk         = require('../../../lib/thunk')

module.exports.test =
    pathEq(['props', 'grant_type'], 'refresh_token')

module.exports.run = state =>
    pipeAsync(
        state => getPublicKey(state.actions.readFile),
        cert  => jwtVerify(state.props.refresh_token, cert, { algorithms: ['RS256'] })
                     .catch(err => Promise.reject(err.message)),
        token => set(lensProp('props'), merge(state.props, { realm: token.realm, username: token.sub }), state),
        state => createJwt(thunk(getPrivateKey, state.actions.readFile), state),
        token => set(lensProp('token'), token, state)
    )(state)
