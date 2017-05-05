/* eslint-disable no-unused-vars */
const callbackify = require('functional-js/promises/callbackify')
const token = require('./actions/token')
const authorize = require('./actions/authorize')
const openidConfiguration = require('./actions/openid-configuration')
const withJsonResponse = require('./lib/serviceHelpers').withJsonResponse
const getRealm = require('./services/storage').getRealm
const logging = require('./services/logging')
const writeLog = require('./services/writeLog')

const actions = {
    getRealm,
    writeLogs: logging,
    writeLog
}

module.exports.openidConfiguration = callbackify((request, context) =>
    withJsonResponse(openidConfiguration)(request, actions)
)

module.exports.token = callbackify((request, context) =>
    withJsonResponse(token)(request)
)

module.exports.authorize = callbackify((request, context) =>
    withJsonResponse(authorize)(request)
)
