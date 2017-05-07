const promisify = require('functional-js/promises/promisify')
const status = require('http-status')
const Joi = require('joi')
const joiValidate = promisify(Joi.validate)
const pathOr = require('ramda/src/pathOr')
const concat = require('ramda/src/concat')
const tail = require('ramda/src/tail')
const pipeAsync = require('../../lib/pipeAsync')

const getRequest = event =>
    Object.assign({}, event.pathParameters)

const options = {
    stripUnknown: true
}

const schema = Joi.object().keys({
    realm: Joi.string().required(),
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
