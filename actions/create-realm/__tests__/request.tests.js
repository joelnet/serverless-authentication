const querystring = require('querystring')
const request = require('../request')

const I = x => x

describe('create-realm', () => {
    test('no realm returns "realm" is required', () => {
        expect.assertions(1)
        const data = {}

        return request(I)(data)
            .catch(error => expect(error).toBe('[400] "realm" is required'))
    })

    test('short realm returns "realm" length must be at least 4 characters long', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'ab' },
        }

        return request(I)(data)
            .catch(error => expect(error).toBe('[400] "realm" length must be at least 4 characters long'))
    })

    test('short realm returns "realm" length must be less than or equal to 30 characters long', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'abcdefghijklmnopqrstuvwxyz0123456789' },
        }

        return request(I)(data)
            .catch(error => expect(error).toBe('[400] "realm" length must be less than or equal to 30 characters long'))
    })

    test('no access_token returns "access_token" is required', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
        }

        return request(I)(data)
            .catch(error => expect(error).toBe('[400] "access_token" is required'))
    })

    test('invalid access_token returns "access_token" is required', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
            body: querystring.encode({
                access_token: 'access_token',
            })
        }

        return request(response => {
            expect(response).toEqual({ realm: 'realm', access_token: 'access_token' })
        })(data)
    })
})
