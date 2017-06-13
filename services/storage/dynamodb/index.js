const client = require('./doc-client')
const getUser = require('./get-user')(client)
const createUser = require('./create-user')(client)
const getRealm = require('./get-realm')(client)
const createRealm = require('./create-realm')(client)

module.exports = {
    getUser,
    createUser,
    getRealm,
    createRealm,
}
