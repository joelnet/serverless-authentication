const Joi = require('joi')
const querystring = require('querystring')
const { getValidatedRequest } = require('../../lib/joi-helpers')

const options = {
    stripUnknown: true
}

const getRequest = event =>
    Object.assign({}, event.queryStringParameters, querystring.parse(event.body), event.pathParameters)

const schema = Joi.object().keys({
    realm: Joi.string().min(4).max(30).required(),
    access_token: Joi.string().required(),
})

module.exports = getValidatedRequest(getRequest, schema, options)
