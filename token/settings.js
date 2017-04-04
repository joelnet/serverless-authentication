module.exports = {
    app: 'token',
    aws: {
        region: 'us-west-2',
        apiVersion: '2012-08-10'
    },
    jwt: {
        options: {
            algorithm: 'RS256',
            expiresIn: 600
        }
    }
}
