const fs = require('fs')
const promisify = require('functional-js/promises/promisify')
const getUser = require('../storage').getUser
const pipeAsync = require('../../lib/pipeAsync')
const withActions = require('../../lib/serviceHelpers').withActions
const getRequest = require('../../requests/tokenRequest')

const createJwt = require('./actions').createJwt
const validateUser = require('./actions').validateUser
const getUserFromStorage = require('./actions').getUserFromStorage

const injectActionsIntoProps = withActions({
    readFile: promisify(fs.readFile),
    getUser
})

const getUserFromStorageAndValidatePassword = props =>
    getUserFromStorage(props)
        .then(validateUser(props))

module.exports = (request, dependencies) =>
    pipeAsync(
        getRequest,
        injectActionsIntoProps(dependencies),
        getUserFromStorageAndValidatePassword,
        createJwt
    )(request)