const validate = require('../request')

describe('requests.authorizeRequest', () => {
    test('no realm returns "realm" is required', () => {
        expect.assertions(1)
        const data = {}

        return validate()(data)
            .catch(error => expect(error).toBe('[400] "realm" is required'))
    })

    test('no response_type returns "response_type" is required', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
        }

        return validate()(data)
            .catch(error => expect(error).toBe('[400] "response_type" is required'))
    })

    test('invalid response_type returns "response_type" must be one of [id_token]', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
            queryStringParameters: {
                response_type: 'invalid',
            }
        }

        return validate()(data)
            .catch(error => expect(error).toBe('[400] "response_type" must be one of [id_token]'))
    })

    test('no scope returns "scope" is required', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
            queryStringParameters: {
                response_type: 'id_token',
            }
        }

        return validate()(data)
            .catch(error => expect(error).toBe('[400] "scope" is required'))
    })

    test('invalid scope returns "scope" must be one of [openid]', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
            queryStringParameters: {
                response_type: 'id_token',
                scope: 'invalid',
            }
        }

        return validate()(data)
            .catch(error => expect(error).toBe('[400] "scope" must be one of [openid]'))
    })

    test('no client_id returns "client_id" is required', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
            queryStringParameters: {
                response_type: 'id_token',
                scope: 'openid',
            }
        }

        return validate()(data)
            .catch(error => expect(error).toBe('[400] "client_id" is required'))
    })

    test('no redirect_uri returns "redirect_uri" is required', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
            queryStringParameters: {
                response_type: 'id_token',
                scope: 'openid',
                client_id: 'client_id',
            }
        }

        return validate()(data)
            .catch(error => expect(error).toBe('[400] "redirect_uri" is required'))
    })

    test('authorizes querystring request', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
            queryStringParameters: {
                response_type: 'id_token',
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
            body: 'response_type=id_token&scope=openid&client_id=client_id&redirect_uri=redirect_uri',
        }

        return validate(data => expect(data).toBeTruthy())(data)
    })
})
