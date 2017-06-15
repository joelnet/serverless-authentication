const config = require('config')
const promisify = require('functional-helpers/promisify')
const Joi = require('joi')
const joiValidate = promisify(Joi.validate)

const schema = Joi.object().keys({
    realmId: Joi.string().regex(/^[^:]+:[^:]+$/).required(),
    owner: Joi.string().required(),
})

const toUserDoc = model => ({
    TableName: config.get('dynamodb.tables.realms'),
    Item: model,
    Expected: {
        realmId: { Exists: false }
    },
})

const rejectMessage = err =>
    Promise.reject(err.message === 'The conditional request failed' ? 'Realm already exists' : err)

/* istanbul ignore next */
module.exports = client => model => {
    const put = promisify(client.put, client)

    return joiValidate(model, schema)
        .then(model => put(toUserDoc(model)).then(() => model))
        .catch(rejectMessage)
}