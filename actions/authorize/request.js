const Joi = require('joi')
const querystring = require('querystring')
const { getValidatedRequest } = require('../../lib/joi-helpers')

const options = {
    stripUnknown: true
}

const getRequest = event =>
    Object.assign({}, event.queryStringParameters, querystring.parse(event.body), event.pathParameters)

const schema = Joi.object().keys({
    realm: Joi.string().required(),
    response_type: Joi.string().valid('id_token').required(),
    scope: Joi.string().valid('openid').required(),
    client_id: Joi.string().required(),
    state: Joi.string(),
    redirect_uri: Joi.string().required()
})

module.exports = getValidatedRequest(getRequest, schema, options)
