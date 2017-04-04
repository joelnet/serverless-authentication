const SUCCESS = require('../statusCodes').SUCCESS
const BAD_REQUEST = require('../statusCodes').BAD_REQUEST

const response = (status, body) =>
    ({ status, body: JSON.stringify(body) })

const failResponse = error => {
    const match = /^\[(\d+)\] (.*$)/.exec(error)
    
    return match
        ? response(match[1], match[2])
        : response(BAD_REQUEST, { error })
}

const successResponse = obj =>
    response(SUCCESS, obj)

const withActions = defaultActions => injectedActions => props => {
    const actions = Object.assign({}, defaultActions, injectedActions)

    return Object.assign({}, props, { actions })
}

const withJsonResponse = func => x =>
    func(x)
        .then(successResponse)
        .catch(failResponse)

module.exports = {
    failResponse,
    successResponse,
    withActions,
    withJsonResponse
}