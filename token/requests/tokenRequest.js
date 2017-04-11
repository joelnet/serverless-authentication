const promisify   = require('functional-js/promises/promisify')
const Joi         = require('joi')
const joiValidate = promisify(Joi.validate)
const path        = require('ramda/src/path')

const getRequest = event => ({
    grant_type: path(['grant_type'], event),
    realm: path(['path', 'realm'], event),
    client_id: path(['client_id'], event),
    username: path(['username'], event),
    password: path(['password'], event),
    refresh_token: path(['refresh_token'], event)
})

const schema = Joi.object().keys({
    grant_type: Joi.string().valid('password', 'refresh_token').required(), /* 'authorization_code' */
    realm: Joi.string().required(),
    client_id: Joi.string().required(),
    username: Joi.any().when('grant_type', { is: 'password', then: Joi.required(), otherwise: Joi.forbidden() }),
    password: Joi.any().when('grant_type', { is: 'password', then: Joi.required(), otherwise: Joi.forbidden() }),
    refresh_token: Joi.any().when('grant_type', { is: 'refresh_token', then: Joi.required(), otherwise: Joi.forbidden() })
})

module.exports = func =>
    function(event) {
        return Promise.resolve(event)
            .then(getRequest)
            .then(request => joiValidate(request, schema))
            .catch(err => Promise.reject(path(['details', 0, 'message'], err)))
            .then(request => func.apply(null, [request].concat(Array.prototype.slice.call(arguments, 1))))
    }
