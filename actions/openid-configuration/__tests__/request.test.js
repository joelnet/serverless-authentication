const validate = require('../request')

describe('openid-configuration.request', () => {
    test('no realm returns 400', () => {
        expect.assertions(1)
        const data = {}

        return validate()(data)
            .catch(err => {
                expect(err).toBe('[400] "realm" is required')
            })
    })

    test('returns request', () => {
        expect.assertions(1)
        const data = {
            pathParameters: { realm: 'realm' }
        }

        return validate(data_ => {
            expect(data_).toEqual(data.pathParameters)
        })(data)
    })
})
