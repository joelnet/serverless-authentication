const keypair = require('keypair')
const fs = require('fs')

const path = './.secrets'
const pair = keypair()

fs.existsSync(path) || fs.mkdirSync(path)
fs.writeFileSync(`${path}/public.key`, pair.public)
fs.writeFileSync(`${path}/private.key`, pair.private)

console.log('RSA Keys were successfully created.') // eslint-disable-line no-console
