const fs = require('fs')
const promisify = require('functional-js/promises/promisify')
const getUser = require('./storage').getUser
const pipeAsync = require('../lib/pipeAsync')
const validatedRequest = require('../requests/tokenRequest')
const logging = require('./logging')

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
            const errors = ((state||{}).logs||[]).filter(log => log.type === 'error')

            return Promise.reject(
                errors.length ? errors[0].message : '[500] Unknown Error'
            )
        })

module.exports = validatedRequest((request, dependencies) => {
    const state = {
        props: request,
        actions: Object.assign({}, actions, dependencies),
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