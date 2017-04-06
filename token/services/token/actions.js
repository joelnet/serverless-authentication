const promisify = require('functional-js/promises/promisify')
const sign = promisify(require('jsonwebtoken').sign)
const validatePassword = promisify(require('bcrypt-nodejs').compare)
const pipeAsync = require('../../lib/pipeAsync')

const generateTokens = props => cert =>
    Promise.all([
        sign({ realm: props.realm, type: 'id_token' }, cert, { audience: props.client_id, subject: props.username, algorithm: 'RS256', expiresIn: process.env.TOKEN_EXPIRATION }),
        sign({ realm: props.realm, type: 'refresh_token' }, cert, { audience: props.client_id, subject: props.username, algorithm: 'RS256', expiresIn: process.env.REFRESH_TOKEN_EXPIRATION })
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
        props.actions.getUser(props.realm, props.username)
            .catch(err => Promise.reject('[500] Unknown Error')),

    validateUser: props =>
        pipeAsync(
            user => user ? user : Promise.reject('[401] Login Failed'),
            user => validatePassword(props.password, user.password),
            valid => valid ? props : Promise.reject('[401] Login Failed'))
}
