const status = require('http-status')
const authorize = require('../index')

// TODO: test logging
const actions = {
    getRealm: realm =>
        Promise.resolve(realm === 'demo' ? { realmId: 'demo', auth_uri: 'http://auth.uri/demo/login' } : null),
    log: {
        debug: () => null,
        info: () => null,
        error: () => null,
    }
}

describe('authorize', () => {
    test('no realm fails', () => {
        expect.assertions(1)

        const request = {}

        return authorize(request, actions)
            .catch(err => expect(err).toBe('[400] "realm" is required'))
    })

    test('no response_type fails', () => {
        expect.assertions(1)

        const request = {
            pathParameters: { realm: 'realm' },
        }

        return authorize(request, actions)
            .catch(err => expect(err).toBe('[400] "response_type" is required'))
    })

    test('invalid response_type fails', () => {
        expect.assertions(1)

        const request = {
            pathParameters: { realm: 'demo' },
            queryStringParameters: {
                response_type: 'fail'
            }
        }

        return authorize(request, actions)
            .catch(err => expect(err).toBe('[400] "response_type" must be one of [id_token]'))
    })

    test('no scope fails', () => {
        expect.assertions(1)

        const request = {
            pathParameters: { realm: 'demo' },
            queryStringParameters: {
                response_type: 'id_token'
            }
        }

        return authorize(request, actions)
            .catch(err => expect(err).toBe('[400] "scope" is required'))
    })

    test('no client_id fails', () => {
        expect.assertions(1)

        const request = {
            pathParameters: { realm: 'demo' },
            queryStringParameters: {
                response_type: 'id_token',
                scope: 'openid'
            }
        }

        return authorize(request, actions)
            .catch(err => expect(err).toBe('[400] "client_id" is required'))
    })

    test('no redirect_uri fails', () => {
        expect.assertions(1)

        const request = {
            pathParameters: { realm: 'demo' },
            queryStringParameters: {
                response_type: 'id_token',
                scope: 'openid',
                client_id: 'client_id'
            }
        }

        return authorize(request, actions)
            .catch(err => expect(err).toBe('[400] "redirect_uri" is required'))
    })

    test('getRealm fails then returns fail', () => {
        expect.assertions(3)

        const request = {
            pathParameters: { realm: 'invalid' },
            queryStringParameters: {
                response_type: 'id_token',
                scope: 'openid',
                client_id: 'client_id',
                redirect_uri: 'redirect_uri'
            }
        }

        const mocks = {
            getRealm: () => Promise.reject('Unknown failure'),
            writeLog: () => null,
            log: actions.log,
        }

        return authorize(request, mocks)
            .then(response => {
                expect(response.statusCode).toBe(status.FOUND)
                expect(response.headers.Location).toBe('redirect_uri?error=Internal%20Server%20Error')
                expect(response.body).toBe('')
            })
    })

    test('invalid realm redirects to redirect_uri with error', () => {
        expect.assertions(3)

        const request = {
            pathParameters: { realm: 'invalid' },
            queryStringParameters: {
                response_type: 'id_token',
                scope: 'openid',
                client_id: 'client_id',
                redirect_uri: 'redirect_uri'
            }
        }

        return authorize(request, actions)
            .then(response => {
                expect(response.statusCode).toBe(status.FOUND)
                expect(response.headers.Location).toBe('redirect_uri?error=realm%20not%20found')
                expect(response.body).toBe('')
            })
    })

    test('need validation redirects to auth_uri', () => {
        expect.assertions(3)

        const request = {
            pathParameters: { realm: 'demo' },
            queryStringParameters: {
                response_type: 'id_token',
                scope: 'openid',
                client_id: 'client_id',
                redirect_uri: 'http://redirect.uri/hello'
            }
        }

        return authorize(request, actions)
            .then(response => {
                expect(response.statusCode).toBe(status.FOUND)
                expect(response.headers.Location).toBe('http://auth.uri/demo/login?state=&redirect_uri=http%3A%2F%2Fredirect.uri%2Fhello')
                expect(response.body).toBe('')
            })
    })
})
