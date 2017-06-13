const config = require('config')
const promisify = require('functional-helpers/promisify')
const first = require('./lib/helpers').first

const USERS = config.get('dynamodb.tables.users')

/* istanbul ignore next */
const query = (client, table, condition, values, filter) =>
    promisify(client.query, client)({
        TableName: table,
        KeyConditionExpression: condition,
        FilterExpression: filter,
        ExpressionAttributeValues: values,
    })

/* istanbul ignore next */
module.exports = client => (realm, userId) =>
    first(query)(client, USERS, 'userId = :userId', { ':userId': `${realm}:${userId}` })
