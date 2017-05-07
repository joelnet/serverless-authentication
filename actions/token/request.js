const promisify = require('functional-js/promises/promisify')
const status = require('http-status')
const Joi = require('joi')
const joiValidate = promisify(Joi.validate)
const querystring = require('querystring')
const pathOr = require('ramda/src/pathOr')
const concat = require('ramda/src/concat')
const tail = require('ramda/src/tail')
const pipeAsync = require('../../lib/pipeAsync')

const getRequest = event =>
    Object.assign({}, event.queryStringParameters, querystring.parse(event.body), event.pathParameters)

const options = {
    stripUnknown: true
}

const schema = Joi.object().keys({
    grant_type: Joi.string().valid('password', 'refresh_token').required(),
    realm: Joi.string().required(),
    client_id: Joi.string().required(),
    username: Joi.any().when('grant_type', { is: 'password', then: Joi.required(), otherwise: Joi.forbidden() }),
    password: Joi.any().when('grant_type', { is: 'password', then: Joi.required(), otherwise: Joi.forbidden() }),
    refresh_token: Joi.any().when('grant_type', { is: 'refresh_token', then: Joi.required(), otherwise: Joi.forbidden() }),
    redirect_uri: Joi.string()
})

const validate = schema => request =>
    joiValidate(request, schema, options)
        .catch(err => Promise.reject(`[${status.BAD_REQUEST}] ` + pathOr(err, ['details', 0, 'message'], err)))

module.exports = func =>
    function (event) {
        return pipeAsync(
            getRequest,
            validate(schema),
            request => func.apply(null, concat([request], tail(arguments)))
        )(event)
    }
