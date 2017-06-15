const config = require('config')
const promisify = require('functional-helpers/promisify')
const Joi = require('joi')
const joiValidate = promisify(Joi.validate)

const schema = Joi.object().keys({
    userId: Joi.string().regex(/^[^:]+:[^:]+:[^:]+$/).required(),
    username: Joi.string().required(),
    emailAddress: Joi.string().email().required(),
    password: Joi.string().required(),
    realm: Joi.string().regex(/^[^:]+:[^:]+$/).required(),
    roles: Joi.array().items(Joi.string().valid('', 'admin')),
})

const toUserDoc = user => ({
    TableName: config.get('dynamodb.tables.users'),
    Item: user,
    Expected: {
        userId: { Exists: false }
    },
})

const rejectMessage = err =>
    Promise.reject(err.message === 'The conditional request failed' ? 'User already exists' : err)

/* istanbul ignore next */
module.exports = client => user => {
    const put = promisify(client.put, client)

    return joiValidate(user, schema)
        .then(user => put(toUserDoc(user)).then(() => user))
        .catch(rejectMessage)
}