const pathOr = require('ramda/src/pathOr')
const status = require('http-status')

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

const isResponse = obj =>
    obj && obj.statusCode > 0 && obj.body != null

const successResponse = obj =>
    isResponse(obj) ? obj : response(status.OK, obj)

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
