const defaultTo = require('ramda/src/defaultTo')
const status    = require('http-status')

const defaultTo500 = defaultTo(500)

const encodeBody = body =>
    typeof body === 'object' ? JSON.stringify(body) : body

const response = (statusCode, body) =>
    ({ statusCode, body: encodeBody(body) })

const failResponse = error => {
    const match = /^\[(\d+)\] (.*$)/.exec(error)
    const statusCode = defaultTo500(parseInt(match[1]))
    
    return match
        ? response(statusCode, { error: match[2] })
        : response(statusCode, { error })
}

const successResponse = obj =>
    response(status.SUCCESS, obj)

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
