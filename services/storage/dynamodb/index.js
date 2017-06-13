const AWS = require('aws-sdk')
const config = require('config')
const createUser = require('./create-user')
const getRealm = require('./get-realm')
const getUser = require('./get-user')

const docClient = new AWS.DynamoDB.DocumentClient({
    region: config.get('aws.region'),
    apiVersion: config.get('aws.apiversion'),
})

module.exports = {
    getUser: getUser(docClient),
    createUser: createUser(docClient),
    getRealm: getRealm(docClient),
}
