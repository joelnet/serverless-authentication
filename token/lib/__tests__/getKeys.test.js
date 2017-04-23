const config = require('config')
const getPrivateKey = require('../getKeys').getPrivateKey
const getPublicKey = require('../getKeys').getPublicKey

test('lib.getKeys.getPublicKey returns public key', () => {
    expect.assertions(1)

    const expected = 'publicKey'

    const readFile = file =>
        file === config.get('certs.publicKey')
            ? Promise.resolve(expected)
            : Promise.reject('invalid file')

    return getPublicKey(readFile)
        .then(actual => expect(actual).toBe(expected))

})

test('lib.getKeys.getPrivateKey returns private key', () => {
    expect.assertions(1)

    const expected = 'privateKey'

    const readFile = file =>
        file === config.get('certs.privateKey')
            ? Promise.resolve(expected)
            : Promise.reject('invalid file')

    return getPrivateKey(readFile)
        .then(actual => expect(actual).toBe(expected))

})
