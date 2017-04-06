const AWS = require('aws-sdk')
const promisify = require('functional-js/promises/promisify')
const docClient = new AWS.DynamoDB.DocumentClient({
        region: process.env.REGION,
        apiVersion: process.env.APIVERSION
    })

const tables = {
    users: `social-${process.env.STAGE}-users`
}

const docClientQuery =
    promisify(docClient.query).bind(docClient)

const query = (table, condition, values) =>
    docClientQuery({
        TableName: table,
        KeyConditionExpression: condition,
        ExpressionAttributeValues: values
    })

const getFirst = results =>
    results.Items[0]

module.exports = {
    getUser: (realm, userId) =>
        query(tables.users, 'userId = :userId', { ':userId': userId })
            .then(getFirst)
}
