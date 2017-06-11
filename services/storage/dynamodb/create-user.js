const config = require('config')
const promisify = require('functional-helpers/promisify')
const Joi = require('joi')
const joiValidate = promisify(Joi.validate)
const docClient = require('./doc-client')

const schema = Joi.object().keys({
    userId: Joi.string().regex(/^[^:]+:[^:]+:[^:]+$/).required(),
    emailAddress: Joi.string().email().required(),
    password: Joi.string().required(),
    realm: Joi.string().regex(/^[^:]+:[^:]+$/).required(),
    roles: Joi.array().items(Joi.string().valid('', 'admin')),
})

const docClientPut =
    promisify(docClient.put, docClient)

const toUserDoc = user => ({
    TableName: config.get('dynamodb.tables.users'),
    Item: user,
    Expected: {
        userId: { Exists: false }
    },
})

const rejectMessage = err =>
    err.message === 'The conditional request failed'
        ? 'User already exists'
        : err

/* istanbul ignore next */
module.exports = (user) =>
    joiValidate(user, schema)
        .then(user => docClientPut(toUserDoc(user)).then(() => user))
        .catch(err => Promise.reject(rejectMessage(err)))
