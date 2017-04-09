const Joi = require('joi')
const promisify = require('functional-js/promises/promisify')
const get = require('../lib/get')
const joiValidate = promisify(Joi.validate)

const getRequest = event => ({
    grant_type: get(['grant_type'], event),
    realm: get(['path', 'realm'], event),
    client_id: get(['client_id'], event),
    username: get(['username'], event),
    password: get(['password'], event),
    refresh_token: get(['refresh_token'], event)
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
            .catch(err => Promise.reject(get(['details', 0, 'message'], err)))
            .then(request => func.apply(null, [request].concat(Array.prototype.slice.call(arguments, 1))))
    }
