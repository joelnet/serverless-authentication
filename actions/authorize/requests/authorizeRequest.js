const promisify = require('functional-js/promises/promisify')
const status = require('http-status')
const Joi = require('joi')
const joiValidate = promisify(Joi.validate)
const pathOr = require('ramda/src/pathOr')
const concat = require('ramda/src/concat')
const tail = require('ramda/src/tail')
const pipeAsync = require('../../../lib/pipeAsync')
const querystring = require('querystring')

const getRequest = event =>
    Object.assign({}, event.queryStringParameters, querystring.parse(event.body), event.pathParameters)

const schema = Joi.object().keys({
    realm: Joi.string().required(),
    response_type: Joi.string().valid('code').required(),
    scope: Joi.string().valid('openid').required(),
    client_id: Joi.string().required(),
    state: Joi.string(),
    redirect_uri: Joi.string().required()
})

const validate = schema => request =>
    joiValidate(request, schema)
        .catch(err => Promise.reject(`[${status.BAD_REQUEST}] ` + pathOr(err, ['details', 0, 'message'], err)))

module.exports = func =>
    function (event) {
        return pipeAsync(
            getRequest,
            validate(schema),
            request => func.apply(null, concat([request], tail(arguments)))
        )(event)
    }
