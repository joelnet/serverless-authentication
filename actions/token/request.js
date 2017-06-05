const Joi = require('joi')
const querystring = require('querystring')
const { getValidatedRequest } = require('../../lib/joi-helpers')

const options = {
    stripUnknown: true
}

const getRequest = event =>
    Object.assign({}, event.queryStringParameters, querystring.parse(event.body), event.pathParameters)

const schema = Joi.object().keys({
    grant_type: Joi.string().valid('password', 'refresh_token').required(),
    realm: Joi.string().required(),
    client_id: Joi.string().required(),
    username: Joi.any().when('grant_type', { is: 'password', then: Joi.required(), otherwise: Joi.forbidden() }),
    password: Joi.any().when('grant_type', { is: 'password', then: Joi.required(), otherwise: Joi.forbidden() }),
    refresh_token: Joi.any().when('grant_type', { is: 'refresh_token', then: Joi.required(), otherwise: Joi.forbidden() }),
    redirect_uri: Joi.string()
})

module.exports = getValidatedRequest(getRequest, schema, options)
