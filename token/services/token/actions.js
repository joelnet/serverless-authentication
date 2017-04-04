const pipeAsync = require('../../lib/pipeAsync')
const crypto = require('../../lib/crypto')

const generateTokens = props => cert =>
    Promise.all([
        crypto.sign({ realm: props.realm, type: 'id_token' }, cert, { audience: props.client_id, subject: props.username, algorithm: 'RS256', expiresIn: process.env.TOKEN_EXPIRATION }),
        crypto.sign({ realm: props.realm, type: 'refresh_token' }, cert, { audience: props.client_id, subject: props.username, algorithm: 'RS256', expiresIn: process.env.REFRESH_TOKEN_EXPIRATION })
    ])

const getCert = props =>
    props.actions.readFile(process.env.CERT, 'utf8')

module.exports = {
    createJwt: props =>
        pipeAsync(
            getCert,
            generateTokens(props),
            tokens => ({ id_token: tokens[0], refresh_token: tokens[1], token_type: 'Bearer' })
        )(props),

    getUserFromStorage: props =>
        props.actions.getUser(props.realm, props.username),

    validateUser: props =>
        pipeAsync(
            user => user ? user : Promise.reject('[401] Login Failed'),
            user => crypto.validatePassword(props.password, user.password),
            valid => valid ? props : Promise.reject('[401] Login Failed'))
}
