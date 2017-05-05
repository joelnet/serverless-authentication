const openidConfiguration = require('../index')

const configuration = {
    issuer: 'https://server.example.com'
}

// TODO: test logging
const actions = {
    getRealm: realm =>
        Promise.resolve(realm === 'demo' ? { realmId: 'demo', auth_uri: 'http://auth.uri/demo/login', configuration } : null)
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

    test('returns openid-configuration', () => {
        expect.assertions(1)

        const request = {
            pathParameters: { realm: 'demo' },
        }

        return openidConfiguration(request, actions)
            .then(data => {
                expect(data).toEqual(configuration)
            })
    })
})