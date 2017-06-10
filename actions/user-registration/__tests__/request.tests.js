const querystring = require('querystring')
const validate = require('../request')
const I = a => a

describe('userRegistrationRequest', () => {
    test('no realm returns [400] "realm" is required', () => {
        expect.assertions(1)
        const data = {}
        return validate(I)(data)
            .catch(error => expect(error).toBe('[400] "realm" is required'))
    })

    test('no client_id returns [400] "client_id" is required', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
        }
        return validate(I)(data)
            .catch(error => expect(error).toBe('[400] "client_id" is required'))
    })

    test('no username returns [400] "username" is required', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
            body: querystring.encode({
                client_id: 'client_id'
            })
        }
        return validate(I)(data)
            .catch(error => expect(error).toBe('[400] "username" is required'))
    })

    test('invalid username returns [400] "username" must be a valid email', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
            body: querystring.encode({
                client_id: 'client_id',
                username: 'invalid'
            })
        }
        return validate(I)(data)
            .catch(error => expect(error).toBe('[400] "username" must be a valid email'))
    })

    test('no password returns [400] "password" is required', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
            body: querystring.encode({
                client_id: 'client_id',
                username: 'email@address.com'
            })
        }
        return validate(I)(data)
            .catch(error => expect(error).toBe('[400] "password" is required'))
    })

    test('no password returns [400] "password" is required', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
            body: querystring.encode({
                client_id: 'client_id',
                username: 'email@address.com',
                password: 'password'
            })
        }
        return validate(request => {
            expect(request).toEqual({ realm: 'realm', client_id: 'client_id', username: 'email@address.com', password: 'password' })
        })(data)
    })
})
