const status            = require('http-status')
const url               = require('url')
const merge             = require('ramda/src/merge')
const set               = require('ramda/src/set')
const lensProp          = require('ramda/src/lensProp')
const validatedRequest  = require('./requests/authorizeRequest')
const pipeAsync         = require('../../lib/pipeAsync')
const exceptionMapper   = require('../../lib/exceptionMapper')
const appendQuery       = require('../../lib/urlHelper').appendQuery
const logging           = require('../../services/logging')
const getRealm          = require('../../services/storage').getRealm

const actions = {
    getRealm,
    writeLogs: logging
}

const getInitialState = (request, actions, dependencies) => ({
    props: request,
    actions: merge(actions, dependencies),
    logs: []
})

const handleException = func => state =>
    func(state)
        .catch(err => {
            console.log('err', err.stack || err) // TOOD: write to a log
            return redirect(appendQuery(state.props.redirect_uri, { error: 'Internal Server Error' }))
        })

const redirect = uri =>
    ({
        statusCode: status.FOUND,
        headers: { Location: uri },
        body: ''
    })

module.exports = validatedRequest((request, dependencies) =>
    handleException(pipeAsync(
        state => state.actions.getRealm(state.props.realm),
        realm => realm ? redirect(appendQuery(realm.auth_uri, { state: request.state, redirect_uri: request.redirect_uri }))
                       : redirect(appendQuery(request.redirect_uri, { error: 'realm not found' }))
    ))(getInitialState(request, actions, dependencies)))
