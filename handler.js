/* eslint-disable no-unused-vars */
const fs = require('fs')
const callbackify = require('functional-js/promises/callbackify')
const promisify = require('functional-js/promises/promisify')
const token = require('./actions/token')
const authorize = require('./actions/authorize')
const openidConfiguration = require('./actions/openid-configuration')
const userRegistration = require('./actions/user-registration')
const withJsonResponse = require('./lib/serviceHelpers').withJsonResponse
const getUser = require('./services/storage').getUser
const createUser = require('./services/storage').createUser
const getRealm = require('./services/storage').getRealm
const logging = require('./services/logging')
const writeLog = require('./services/writeLog')

const actions = {
    getRealm,
    getUser,
    createUser,
    readFile: promisify(fs.readFile),
    writeLogs: logging,
    writeLog
}

module.exports.openidConfiguration = callbackify((request, context) =>
    withJsonResponse(openidConfiguration)(request, actions)
)

module.exports.token = callbackify((request, context) =>
    withJsonResponse(token)(request, actions)
)

module.exports.authorize = callbackify((request, context) =>
    withJsonResponse(authorize)(request, actions)
)

module.exports.userRegistration = callbackify((request, context) =>
    withJsonResponse(userRegistration)(request, actions)
)
