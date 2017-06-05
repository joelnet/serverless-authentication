const Joi = require('joi')
const { getValidatedRequest } = require('../../lib/joi-helpers')

const options = {
    stripUnknown: true
}

const schema = Joi.object().keys({
    realm: Joi.string().required(),
})

const getRequest = event =>
    Object.assign({}, event.pathParameters)

module.exports = getValidatedRequest(getRequest, schema, options)
