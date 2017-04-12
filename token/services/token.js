const fs                 = require('fs')
const promisify          = require('functional-js/promises/promisify')
const merge              = require('ramda/src/merge')
const pathOr             = require('ramda/src/pathOr')
const propOr             = require('ramda/src/propOr')
const defaultTo          = require('ramda/src/defaultTo')
const getUser            = require('./storage').getUser
const pipeAsync          = require('../lib/pipeAsync')
const validatedRequest   = require('../requests/tokenRequest')
const logging            = require('./logging')

const createJwt = require('../actions/createJwt')
const validateUser = require('../actions/validateUser')
const getUserFromStorage = require('../actions/getUserFromStorage')
const writeLogs = state => state.actions.writeLogs(state)

const actions = {
    getUser,
    readFile: promisify(fs.readFile),
    writeLogs: logging
}

const handleException = func => state =>
    func(state)
        .catch(state => {
            const errors = propOr([], 'logs', state).filter(log => log.type === 'error')

            return Promise.reject(
                pathOr('[500] Unknown Error', [0, 'message'], errors)
            )
        })

module.exports = validatedRequest((request, dependencies) => {
    const state = {
        props: request,
        actions: merge(actions, dependencies),
        logs: []
    }

    return handleException(pipeAsync(
        getUserFromStorage,
        validateUser,
        writeLogs,
        createJwt,
        state => state.token
    ))(state)
})