/* eslint-disable no-unused-vars */
const bunyan = require('bunyan')
const bformat = require('bunyan-format')
const fs = require('fs')
const callbackify = require('functional-helpers/callbackify')
const promisify = require('functional-helpers/promisify')
const token = require('./actions/token')
const authorize = require('./actions/authorize')
const openidConfiguration = require('./actions/openid-configuration')
const userRegistration = require('./actions/user-registration')
const withJsonResponse = require('./lib/serviceHelpers').withJsonResponse
const getUser = require('./services/storage').getUser
const createUser = require('./services/storage').createUser
const getRealm = require('./services/storage').getRealm
const logging = require('./services/logging')

const actions = {
    getRealm,
    getUser,
    createUser,
    readFile: promisify(fs.readFile),
    log: bunyan.createLogger({
        name: 'mojo-auth',
        stream: bformat({ outputMode: process.env.SLS_DEBUG ? 'short' : 'bunyan' }),
        level: 'debug'
    }),
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
