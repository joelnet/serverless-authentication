const promisify   = require('functional-js/promises/promisify')
const Joi         = require('joi')
const joiValidate = promisify(Joi.validate)
const path        = require('ramda/src/path')
const pathOr      = require('ramda/src/pathOr')
const prop        = require('ramda/src/prop')
const concat      = require('ramda/src/concat')
const tail        = require('ramda/src/tail')
const pipeAsync   = require('../lib/pipeAsync')

const getRequest = event => ({
    realm: path(['path', 'realm'], event),
    response_type: prop('response_type', event),
    scope: prop('scope', event),
    client_id: prop('client_id', event),
    state: prop('state', event),
    redirect_uri: prop('redirect_uri',event)
})

const schema = Joi.object().keys({
    realm: Joi.string().required(),
    response_type: Joi.string().valid('code').required(),
    scope: Joi.string().valid('openid').required(),
    client_id: Joi.string().required(),
    state: Joi.string(),
    redirect_uri: Joi.string().required()
})

const validate = (request, schema) =>
    joiValidate(request, schema)
        .catch(err => Promise.reject(pathOr(err, ['details', 0, 'message'], err)))

module.exports = func =>
    function(event) {
        return pipeAsync(
            getRequest,
            request => validate(request, schema),
            request => func.apply(null, concat([request], tail(arguments)))
        )(event)
    }
