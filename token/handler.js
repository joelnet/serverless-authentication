const callbackify = require('functional-js/promises/callbackify')
const withLibs = require('./lib/withLibs')

const libs = {
    fs: require('fs')
}

const tokenService = withLibs(libs, require('./services/tokenService'))

module.exports.token = callbackify((event, context) =>
   tokenService({ event })
)
