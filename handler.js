/* eslint-disable no-unused-vars */
const callbackify = require('functional-js/promises/callbackify')
const token = require('./actions/token')
const authorize = require('./actions/authorize')
const withJsonResponse = require('./lib/serviceHelpers').withJsonResponse

module.exports.token = callbackify((request, context) =>
    withJsonResponse(token)(request)
)

module.exports.authorize = callbackify((request, context) =>
    withJsonResponse(authorize)(request)
)
