const pathOr    = require('ramda/src/pathOr')
const defaultTo = require('ramda/src/defaultTo')
const status    = require('http-status')

const defaultTo500 = defaultTo(500)

const encodeBody = body =>
    typeof body === 'object' ? JSON.stringify(body) : body

const response = (statusCode, body) =>
    ({ statusCode, body: encodeBody(body) })

const failResponse = error => {
    const match = /^\[(\d+)\] (.*$)/.exec(error)
    const statusCode = parseInt(pathOr(500, [1], match))
    
    return match
        ? response(statusCode, { error: match[2] })
        : response(statusCode, { error })
}

const successResponse = obj =>
    response(status.OK, obj)

const withJsonResponse = func => x =>
    func(x)
        .then(successResponse)
        .catch(failResponse)

const redirectResponse = uri =>
    ({
        statusCode: status.FOUND,
        headers: {
            Location: uri
        },
        body: ''
    })

module.exports = {
    redirectResponse,
    withJsonResponse
}
