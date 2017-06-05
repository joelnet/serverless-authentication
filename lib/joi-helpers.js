const promisify = require('functional-js/promises/promisify')
const status = require('http-status')
const Joi = require('joi')
const joiValidate = promisify(Joi.validate)
const pathOr = require('ramda/src/pathOr')
const pipeAsync = require('./pipeAsync')

const validate = (request, schema, options) =>
    joiValidate(request, schema, options)
        .catch(err => Promise.reject(`[${status.BAD_REQUEST}] ${pathOr(err, ['details', 0, 'message'], err)}`))

module.exports.getValidatedRequest = (getRequest, schema, options) => func => (event, ...args) =>
    pipeAsync(
        getRequest,
        request => validate(request, schema, options),
        request => func.apply(null, [request, ...args])
    )(event)
