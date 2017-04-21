const callbackify      = require('functional-js/promises/callbackify')
const token            = require('./token')
const withJsonResponse = require('./lib/serviceHelpers').withJsonResponse

module.exports.token = callbackify((event, context) =>
    withJsonResponse(token)(event))
