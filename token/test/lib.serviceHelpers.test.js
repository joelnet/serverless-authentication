const test                 = require('tape')
const path                 = require('ramda/src/path')
const { redirectResponse,
        withJsonResponse } = require('../lib/serviceHelpers')

test('lib.serviceHelpers.redirectResponse.redirectResponse returns response', t => {
    t.plan(3)

    const redirect_uri = 'http://mock-redirect-uri.com/page'

    const result = redirectResponse(redirect_uri)

    t.equal(result.statusCode, 302, 'statusCode must be 302')
    t.equal(path(['headers', 'Location'], result), redirect_uri, 'Location must equal redirect_uri'),
    t.equal(result.body, '', 'body must equal ""')
})

test('lib.serviceHelpers.withJsonResponse with fail response returns fail', t => {
    t.plan(2)

    const state = {}

    withJsonResponse(() => Promise.reject('[123] status 123'))(state)
        .then(response => {
            t.equal(response.statusCode, 123, 'status must equal 123')
            t.equal(response.body, '{"error":"status 123"}', 'body must equal status 123')
        })
})

test('lib.serviceHelpers.withJsonResponse with unknown failure returns 500', t => {
    t.plan(2)

    const state = {}

    withJsonResponse(() => Promise.reject('uh oh'))(state)
        .then(response => {
            t.equal(response.statusCode, 500, 'status must equal 500')
            t.equal(response.body, '{"error":"uh oh"}', 'body must equal "uh oh"')
        })
})

