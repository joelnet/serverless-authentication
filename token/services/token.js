const fs               = require('fs')
const promisify        = require('functional-js/promises/promisify')
const merge            = require('ramda/src/merge')
const prop             = require('ramda/src/prop')
const getUser          = require('./storage').getUser
const pipeAsync        = require('../lib/pipeAsync')
const validatedRequest = require('../requests/tokenRequest')
const logging          = require('./logging')
const strategies       = require('../strategies')
const exceptionMapper  = require('../lib/exceptionMapper')

const actions = {
    getUser,
    readFile: promisify(fs.readFile),
    writeLogs: logging
}

const runTokenStrategy = state =>
    strategies
        .find(o => o.test(state))
        .run(state)

const writeLogs = state =>
    state.actions.writeLogs(state)

const reject = func => x =>
    Promise.reject(func(x))

const handleException = func => state =>
    func(state)
        .catch(reject(exceptionMapper))

module.exports = validatedRequest((request, dependencies) => {
    const state = {
        props: request,
        actions: merge(actions, dependencies),
        logs: []
    }

    return handleException(pipeAsync(
        runTokenStrategy,
        writeLogs,
        prop('token')
    ))(state)
})
