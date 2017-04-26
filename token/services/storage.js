const AWS       = require('aws-sdk')
const config    = require('config')
const promisify = require('functional-js/promises/promisify')
const path      = require('ramda/src/path')

const USERS = config.get('dynamodb.tables.users')
const REALMS = config.get('dynamodb.tables.realms')

const docClient = new AWS.DynamoDB.DocumentClient({
        region: config.get('aws.region'),
        apiVersion: config.get('aws.apiversion')
    })

const docClientQuery =
    promisify(docClient.query).bind(docClient)

/* istanbul ignore next */
const query = (table, condition, values, filter) =>
    docClientQuery({
        TableName: table,
        KeyConditionExpression: condition,
        FilterExpression: filter,
        ExpressionAttributeValues: values
    })

const getFirst =
    path(['Items', 0])

/* istanbul ignore next */
module.exports.getUser = (realm, userId) =>
    query(USERS, 'userId = :userId', { ':userId': `${realm}:${userId}` })
        .then(getFirst)

/* istanbul ignore next */
module.exports.getRealm = realmId =>
    query(REALMS, 'realmId = :realmId', { ':realmId': realmId })

