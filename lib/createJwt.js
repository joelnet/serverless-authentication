const config = require('config')
const promisify = require('functional-helpers/promisify')
const sign = promisify(require('jsonwebtoken').sign)
const pathOr = require('ramda/src/pathOr')
const uuid = require('uuid/v4')
const pipeAsync = require('../lib/pipeAsync')

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
    ]).then(tokens => ({
        access_token: tokens[0],
        id_token: tokens[1],
        refresh_token: tokens[2]
    }))

module.exports = (getToken, state) =>
    pipeAsync(
        getToken,
        generateTokensWithCert(state)
    )(state)
