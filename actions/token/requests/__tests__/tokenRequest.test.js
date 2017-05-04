const validate = require('../tokenRequest')

describe('tokenRequest', () => {
    test('requests/tokenRequest with no object returns grant_type error', () => {
        expect.assertions(1)
        const data = {}

        return validate()(data)
            .catch(error => expect(error).toBe('"grant_type" is required'))
    })

    test('requests/tokenRequest with no realm returns realm error', () => {
        expect.assertions(1)
        const data = {
            body: "grant_type=password"
        }

        return validate()(data)
            .catch(error => expect(error).toBe('"realm" is required'))
    })

    test('requests/tokenRequest with no client_id returns realm error', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
            body: "grant_type=password"
        }

        return validate()(data)
            .catch(error => expect(error).toBe('"client_id" is required'))
    })

    test('requests/tokenRequest with grant_type=password and no username returns username error', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
            body: "grant_type=password&client_id=client_id"
        }

        return validate()(data)
            .catch(error => expect(error).toBe('"username" is required'))
    })

    test('requests/tokenRequest with grant_type=password and no password returns password error', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
            body: "grant_type=password&client_id=client_id&username=username"
        }

        return validate()(data)
            .catch(error => expect(error).toBe('"password" is required'))
    })

    test('requests/tokenRequest with grant_type=password and refresh_token returns refresh_token error', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
            body: "grant_type=password&client_id=client_id&username=username&password=password&refresh_token=refresh_token"
        }

        return validate()(data)
            .catch(error => expect(error).toBe('"refresh_token" is not allowed'))
    })

    test('requests/tokenRequest with grant_type=password returns success', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
            body: "grant_type=password&client_id=client_id&username=username&password=password"
        }

        return validate(x => x)(data)
            .then(data => expect(data).toBeTruthy())
    })

    test('requests/tokenRequest with grant_type=refresh_token and no refresh_token returns refresh_token error', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
            body: "grant_type=refresh_token&client_id=client_id"
        }

        return validate()(data)
            .catch(error => expect(error).toBe('"refresh_token" is required'))
    })

    test('requests/tokenRequest with grant_type=refresh_token and username returns username error', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
            body: "grant_type=refresh_token&client_id=client_id&username=username"
        }

        return validate()(data)
            .catch(error => expect(error).toBe('"username" is not allowed'))
    })

    test('requests/tokenRequest with grant_type=refresh_token and password returns password error', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
            body: "grant_type=refresh_token&client_id=client_id&password=password"
        }

        return validate()(data)
            .catch(error => expect(error).toBe('"password" is not allowed'))
    })

    test('requests/tokenRequest with grant_type=refresh_token returns success', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
            body: "grant_type=refresh_token&client_id=client_id&refresh_token=refresh_token"
        }

        return validate(x => x)(data)
            .then(data => expect(data).toBeTruthy())
    })

    test('requests/tokenRequest calls func', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' },
            body: "grant_type=refresh_token&client_id=client_id&refresh_token=refresh_token"
        }

        return validate(data => expect(data).toBeTruthy())(data)
    })
})
