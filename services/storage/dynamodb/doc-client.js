const AWS = require('aws-sdk')
const config = require('config')

module.exports = new AWS.DynamoDB.DocumentClient({
    region: config.get('aws.region'),
    apiVersion: config.get('aws.apiversion'),
})
