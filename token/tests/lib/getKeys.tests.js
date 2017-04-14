const config = require('config')
const test = require('tape')
const getPrivateKey = require('../../lib/getKeys').getPrivateKey
const getPublicKey = require('../../lib/getKeys').getPublicKey

test('lib.getKeys.getPublicKey returns public key', t => {
    t.plan(1)

    const expected = 'publicKey'

    const readFile = file =>
        file === config.get('certs.publicKey')
            ? Promise.resolve(expected)
            : Promise.reject('invalid file')

    getPublicKey(readFile)
        .then(actual => t.equal(actual, expected))

})

test('lib.getKeys.getPrivateKey returns private key', t => {
    t.plan(1)

    const expected = 'privateKey'

    const readFile = file =>
        file === config.get('certs.privateKey')
            ? Promise.resolve(expected)
            : Promise.reject('invalid file')

    getPrivateKey(readFile)
        .then(actual => t.equal(actual, expected))

})
