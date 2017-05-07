const path = require('ramda/src/path')
const redirectResponse = require('../serviceHelpers').redirectResponse
const withJsonResponse = require('../serviceHelpers').withJsonResponse

describe('lib.serviceHelpers.redirectResponse', () => {
    test('returns response', () => {
        expect.assertions(3)

        const redirect_uri = 'http://mock-redirect-uri.com/page'

        const result = redirectResponse(redirect_uri)

        expect(result.statusCode).toBe(302)
        expect(path(['headers', 'Location'], result)).toBe(redirect_uri),
            expect(result.body).toBe('')
    })
})

describe('lib.serviceHelpers.withJsonResponse', () => {
    test('with fail response returns fail', () => {
        expect.assertions(2)

        const state = {}

        return withJsonResponse(() => Promise.reject('[123] status 123'))(state)
            .then(response => {
                expect(response.statusCode).toBe(123)
                expect(response.body).toBe('{"error":"status 123"}')
            })
    })

    test('with unknown failure returns 500', () => {
        expect.assertions(2)

        const state = {}

        return withJsonResponse(() => Promise.reject('uh oh'))(state)
            .then(response => {
                expect(response.statusCode).toBe(500)
                expect(response.body).toBe('{"error":"uh oh"}')
            })
    })

    test('with unknown failure returns 500', () => {
        expect.assertions(2)

        const state = {}

        return withJsonResponse(() => Promise.reject('uh oh'))(state)
            .then(response => {
                expect(response.statusCode).toBe(500)
                expect(response.body).toBe('{"error":"uh oh"}')
            })
    })

    test('with response returns success', () => {
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

    test('with string response returns success', () => {
        expect.assertions(2)

        const state = "success-true"

        return withJsonResponse(data => Promise.resolve(data))(state)
            .then(response => {
                expect(response.statusCode).toBe(200)
                expect(response.body).toBe('success-true')
            })
    })

    test('with string response returns success', () => {
        expect.assertions(2)

        const state = "success-true"

        return withJsonResponse(data => Promise.resolve(data))(state)
            .then(response => {
                expect(response.statusCode).toBe(200)
                expect(response.body).toBe('success-true')
            })
    })

    test('with response object returns objecct', () => {
        expect.assertions(2)

        const state = {
            statusCode: 123,
            body: "success"
        }

        return withJsonResponse(data => Promise.resolve(data))(state)
            .then(response => {
                console.log(response)
                expect(response.statusCode).toBe(state.statusCode)
                expect(response.body).toBe(state.body)
            })
    })
})
