const callbackify      = require('functional-js/promises/callbackify')
const token            = require('./actions/token')
const authorize        = require('./actions/authorize')
const withJsonResponse = require('./lib/serviceHelpers').withJsonResponse

module.exports.token = callbackify((event, context) =>
    withJsonResponse(token)(event))

module.exports.authorize = callbackify((event, context) =>
    withJsonResponse(authorize)(event))
