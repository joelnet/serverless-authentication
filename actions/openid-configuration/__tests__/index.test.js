const openidConfiguration = require('../index')

const configuration = {
    issuer: 'https://server.example.com'
}

// TODO: test logging
const actions = {
    getRealm: realm =>
        Promise.resolve(realm === 'demo' ? { realmId: 'demo', auth_uri: 'http://auth.uri/demo/login', configuration } : null),
    log: {
        debug: () => null,
        info: () => null,
        error: () => null,
    },
}

describe('openid-configuration', () => {
    test('no realm returns 400', () => {
        expect.assertions(1)

        const request = {}

        return openidConfiguration(request, actions)
            .catch(err => {
                expect(err).toBe('[400] "realm" is required')
            })
    })

    test('unknown realm returns 404', () => {
        expect.assertions(1)

        const request = {
            pathParameters: {
                realm: "unknown"
            }
        }

        return openidConfiguration(request, actions)
            .catch(err => {
                expect(err).toBe('[404] Not Found')
            })
    })

    test('returns openid-configuration', () => {
        expect.assertions(1)

        const request = {
            pathParameters: { realm: 'demo' },
        }

        return openidConfiguration(request, actions)
            .then(data => {
                expect(data.authorization_endpoint).toMatch(/demo/)
            })
    })
})