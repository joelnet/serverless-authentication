const AWS = require('aws-sdk')
const config = require('config')
const promisify = require('functional-helpers/promisify')
const createUser = require('./create-user')
const getRealm = require('./get-realm')
const first = require('./lib/helpers').first

const USERS = config.get('dynamodb.tables.users')

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
module.exports.createUser = createUser(docClient)

/* istanbul ignore next */
module.exports.getRealm = getRealm(docClient)
