const config = require('config')

module.exports.getPrivateKey = readFile =>
    readFile(config.get('certs.privateKey'), 'utf8')

module.exports.getPublicKey = readFile =>
    readFile(config.get('certs.publicKey'), 'utf8')
