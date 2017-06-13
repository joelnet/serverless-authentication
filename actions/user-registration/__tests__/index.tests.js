const querystring = require('querystring')
const userRegistration = require('..')
const R = require('ramda')

const actions = {
    log: {
        debug: () => null,
        info: () => null,
        error: (...args) => console.log(...args),
    },
    getRealm: realm =>
        Promise.resolve(realm === 'realm' ? { realmId: 'realm', auth_uri: 'http://auth.uri/demo/login' } : null),
    createUser: user => user.emailAddress === 'test@test.com' ? Promise.reject('User already exists') : Promise.resolve(),
}

describe('user-registration', () => {
    test('no realm returns [400] "realm" is required', () => {
        expect.assertions(1)

        const request = {}

        return userRegistration(request, actions)
            .catch(err => expect(err).toBe('[400] "realm" is required'))
    })

    test('no client_id returns [400] "client_id" is required', () => {
        expect.assertions(1)

        const request = {
            pathParameters: { realm: 'realm' },
        }

        return userRegistration(request, actions)
            .catch(err => expect(err).toBe('[400] "client_id" is required'))
    })

    test('no username returns [400] "username" is required', () => {
        expect.assertions(1)

        const request = {
            pathParameters: { realm: 'realm' },
            body: querystring.stringify({
                client_id: 'client_id',
            })
        }

        return userRegistration(request, actions)
            .catch(err => expect(err).toBe('[400] "username" is required'))
    })

    test('email returns [400] "email" is required', () => {
        expect.assertions(1)

        const request = {
            pathParameters: { realm: 'realm' },
            body: querystring.stringify({
                client_id: 'client_id',
                username: 'username',
            })
        }

        return userRegistration(request, actions)
            .catch(err => expect(err).toBe('[400] "email" is required'))
    })

    test('invalid email returns [400] "email" must be a valid email', () => {
        expect.assertions(1)

        const request = {
            pathParameters: { realm: 'realm' },
            body: querystring.stringify({
                client_id: 'client_id',
                username: 'username',
                email: 'invalid',
            })
        }

        return userRegistration(request, actions)
            .catch(err => expect(err).toBe('[400] "email" must be a valid email'))
    })

    test('no password returns [400] "password" is required', () => {
        expect.assertions(1)

        const request = {
            pathParameters: { realm: 'realm' },
            body: querystring.stringify({
                client_id: 'client_id',
                username: 'test@test.com',
                email: 'test@test.com',
            })
        }

        return userRegistration(request, actions)
            .catch(err => expect(err).toBe('[400] "password" is required'))
    })

    test('invalid realm returns [404] Not Found', () => {
        expect.assertions(2)

        const request = {
            pathParameters: { realm: 'invalid' },
            body: querystring.stringify({
                client_id: 'client_id',
                username: 'test@test.com',
                email: 'test@test.com',
                password: 'password'
            })
        }

        const myActions = R.set(R.lensPath(['log', 'error']), err => {
            expect(err).toBe('Realm not found')
        }, actions)

        return userRegistration(request, myActions)
            .catch(err => expect(err).toBe('[404] Not Found'))
    })

    test('existing user returns [403] User already exists', () => {
        expect.assertions(2)

        const request = {
            pathParameters: { realm: 'realm' },
            body: querystring.stringify({
                client_id: 'client_id',
                username: 'test@test.com',
                email: 'test@test.com',
                password: 'password'
            })
        }

        const myActions = R.set(R.lensPath(['log', 'error']), err => {
            expect(err).toBe('User already exists')
        }, actions)

        return userRegistration(request, myActions)
            .catch(err => expect(err).toBe('[403] User already exists'))
    })

    test('creates user', () => {
        expect.assertions(1)

        const request = {
            pathParameters: { realm: 'realm' },
            body: querystring.stringify({
                client_id: 'client_id',
                username: 'username',
                email: 'test2@test.com',
                password: 'password'
            })
        }

        return userRegistration(request, actions)
            .then(response => expect(response).toEqual({ statusCode: 201 }))
    })
})
