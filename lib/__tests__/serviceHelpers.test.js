const path             = require('ramda/src/path')
const redirectResponse = require('../serviceHelpers').redirectResponse
const withJsonResponse = require('../serviceHelpers').withJsonResponse

test('lib.serviceHelpers.redirectResponse.redirectResponse returns response', () => {
    expect.assertions(3)

    const redirect_uri = 'http://mock-redirect-uri.com/page'

    const result = redirectResponse(redirect_uri)

    expect(result.statusCode).toBe(302)
    expect(path(['headers', 'Location'], result)).toBe(redirect_uri),
    expect(result.body).toBe('')
})

test('lib.serviceHelpers.withJsonResponse with fail response returns fail', () => {
    expect.assertions(2)

    const state = {}

    return withJsonResponse(() => Promise.reject('[123] status 123'))(state)
        .then(response => {
            expect(response.statusCode).toBe(123)
            expect(response.body).toBe('{"error":"status 123"}')
        })
})

test('lib.serviceHelpers.withJsonResponse with unknown failure returns 500', () => {
    expect.assertions(2)

    const state = {}

    return withJsonResponse(() => Promise.reject('uh oh'))(state)
        .then(response => {
            expect(response.statusCode).toBe(500)
            expect(response.body).toBe('{"error":"uh oh"}')
        })
})

test('lib.serviceHelpers.withJsonResponse with unknown failure returns 500', () => {
    expect.assertions(2)

    const state = {}

    return withJsonResponse(() => Promise.reject('uh oh'))(state)
        .then(response => {
            expect(response.statusCode).toBe(500)
            expect(response.body).toBe('{"error":"uh oh"}')
        })
})

test('lib.serviceHelpers.withJsonResponse with response returns success', () => {
    expect.assertions(2)

    const state = {
        success: true
    }

    return withJsonResponse(data => Promise.resolve(data))(state)
        .then(response => {
            expect(response.statusCode).toBe(200)
            expect(response.body).toBe('{"success":true}')
        })
})

test('lib.serviceHelpers.withJsonResponse with string response returns success', () => {
    expect.assertions(2)

    const state = "success-true"

    return withJsonResponse(data => Promise.resolve(data))(state)
        .then(response => {
            expect(response.statusCode).toBe(200)
            expect(response.body).toBe('success-true')
        })
})
