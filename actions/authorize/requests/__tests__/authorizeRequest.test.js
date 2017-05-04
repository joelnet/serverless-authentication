const validate = require('../authorizeRequest')

describe('requests.authorizeRequest', () => {
    test('no realm returns "realm" is required', () => {
        expect.assertions(1)
        const data = {}

        return validate()(data)
            .catch(error => expect(error).toBe('"realm" is required'))
    })

    test('no response_type returns "response_type" is required', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
        }

        return validate()(data)
            .catch(error => expect(error).toBe('"response_type" is required'))
    })

    test('invalid response_type returns "response_type" must be one of [code]', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
            queryStringParameters: {
                response_type: 'invalid',
            }
        }

        return validate()(data)
            .catch(error => expect(error).toBe('"response_type" must be one of [code]'))
    })

    test('no scope returns "scope" is required', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
            queryStringParameters: {
                response_type: 'code',
            }
        }

        return validate()(data)
            .catch(error => expect(error).toBe('"scope" is required'))
    })

    test('invalid scope returns "scope" must be one of [openid]', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
            queryStringParameters: {
                response_type: 'code',
                scope: 'invalid',
            }
        }

        return validate()(data)
            .catch(error => expect(error).toBe('"scope" must be one of [openid]'))
    })

    test('no client_id returns "client_id" is required', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
            queryStringParameters: {
                response_type: 'code',
                scope: 'openid',
            }
        }

        return validate()(data)
            .catch(error => expect(error).toBe('"client_id" is required'))
    })

    test('no redirect_uri returns "redirect_uri" is required', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
            queryStringParameters: {
                response_type: 'code',
                scope: 'openid',
                client_id: 'client_id',
            }
        }

        return validate()(data)
            .catch(error => expect(error).toBe('"redirect_uri" is required'))
    })

    test('authorizes querystring request', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
            queryStringParameters: {
                response_type: 'code',
                scope: 'openid',
                client_id: 'client_id',
                redirect_uri: 'redirect_uri',
            }
        }

        return validate(data => expect(data).toBeTruthy())(data)
    })

    test('authorizes form post request', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
            body: 'response_type=code&scope=openid&client_id=client_id&redirect_uri=redirect_uri',
        }

        return validate(data => expect(data).toBeTruthy())(data)
    })
})
