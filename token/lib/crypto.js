const promisify = require('functional-js/promises/promisify')
const sign = promisify(require('jsonwebtoken').sign)
const validatePassword = promisify(require('bcrypt-nodejs').compare)

module.exports = {
    validatePassword,
    sign
} 
