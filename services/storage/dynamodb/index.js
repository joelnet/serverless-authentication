const AWS = require('aws-sdk')
const config = require('config')
const promisify = require('functional-helpers/promisify')
const path = require('ramda/src/path')
const createUser = require('./create-user')
const first = require('./lib/helpers').first

const USERS = config.get('dynamodb.tables.users')
const REALMS = config.get('dynamodb.tables.realms')

const docClient = new AWS.DynamoDB.DocumentClient({
    region: config.get('aws.region'),
    apiVersion: config.get('aws.apiversion'),
})

const docClientQuery = promisify(docClient.query, docClient)

/* istanbul ignore next */
const query = (table, condition, values, filter) =>
    docClientQuery({
        TableName: table,
        KeyConditionExpression: condition,
        FilterExpression: filter,
        ExpressionAttributeValues: values,
    })

/* istanbul ignore next */
module.exports.getUser = (realm, userId) =>
    first(query)(USERS, 'userId = :userId', { ':userId': `${realm}:${userId}` })

/* istanbul ignore next */
module.exports.createUser = createUser

/* istanbul ignore next */
module.exports.getRealm = realmId =>
    first(query)(REALMS, 'realmId = :realmId', { ':realmId': realmId })
