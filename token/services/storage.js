const AWS       = require('aws-sdk')
const promisify = require('functional-js/promises/promisify')
const path      = require('ramda/src/path')

const USERS = `social-${process.env.STAGE}-users`

const docClient = new AWS.DynamoDB.DocumentClient({
        region: process.env.REGION,
        apiVersion: process.env.APIVERSION
    })

const docClientQuery =
    promisify(docClient.query).bind(docClient)

const query = (table, condition, values) =>
    docClientQuery({
        TableName: table,
        KeyConditionExpression: condition,
        ExpressionAttributeValues: values
    })

const getFirst =
    path(['Items', 0])

module.exports.getUser = (realm, userId) =>
    query(USERS, 'userId = :userId', { ':userId': userId })
        .then(getFirst)
