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
    client_id: Joi.string().required(),
    username: Joi.string().alphanum().min(4).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    redirect_uri: Joi.string()
})

module.exports = getValidatedRequest(getRequest, schema, options)
