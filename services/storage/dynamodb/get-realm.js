const config = require('config')
const promisify = require('functional-helpers/promisify')
const first = require('./lib/helpers').first

const REALMS = config.get('dynamodb.tables.realms')

/* istanbul ignore next */
const query = (client, table, condition, values, filter) =>
    promisify(client.query, client)({
        TableName: table,
        KeyConditionExpression: condition,
        FilterExpression: filter,
        ExpressionAttributeValues: values,
    })

/* istanbul ignore next */
module.exports = client => realmId =>
    first(query)(client, REALMS, 'realmId = :realmId', { ':realmId': realmId })
