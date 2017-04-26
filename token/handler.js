const callbackify      = require('functional-js/promises/callbackify')
const token            = require('./token')
const authorize        = require('./authorize')
const withJsonResponse = require('./lib/serviceHelpers').withJsonResponse

module.exports.token = callbackify((event, context) =>
    withJsonResponse(token)(event))

module.exports.authorize = callbackify((event, context) =>
    withJsonResponse(authorize)(event))
