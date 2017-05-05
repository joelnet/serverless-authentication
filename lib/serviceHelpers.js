const config = require('config')
const pathOr = require('ramda/src/pathOr')
const status = require('http-status')
const merge = require('ramda/src/merge')
const mergeWith = require('ramda/src/mergeWith')

const addCorsHeaders = response =>
    mergeWith(merge, response, { headers: config.get('aws.cors.headers') })

const encodeBody = body =>
    typeof body === 'object' ? JSON.stringify(body) : body

const response = (statusCode, body) =>
    ({ statusCode, body: encodeBody(body) })

const isResponse = obj =>
    obj && obj.statusCode > 0

const successResponse = obj =>
    isResponse(obj) ? obj : response(status.OK, obj)

const failResponse = error => {
    const match = /^\[(\d+)\] (.*$)/.exec(error)
    const statusCode = parseInt(pathOr(500, [1], match))

    return match
        ? response(statusCode, { error: match[2] })
        : response(statusCode, { error })
}

const withJsonResponse = func => (...args) =>
    func(...args)
        .then(successResponse)
        .catch(failResponse)
        .then(addCorsHeaders)

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
