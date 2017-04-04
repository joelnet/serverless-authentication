const AWS = require('aws-sdk')
const settings = require('../settings')
const promisify = require('functional-js/promises/promisify')
const docClient = new AWS.DynamoDB.DocumentClient(settings.aws)

const query = promisify(docClient.query).bind(docClient)

const tables = {
    users: `social-${process.env.STAGE}-users`
}

const getFirst = results => results.Items[0]

module.exports = {
    getUser: (realm, userId) =>
        query({
                TableName: tables.users,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: { ':userId': userId }
            })
            .then(getFirst)
}
