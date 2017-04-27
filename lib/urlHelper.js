const parse             = require('url').parse
const format            = require('url').format
const merge             = require('ramda/src/merge')
const set               = require('ramda/src/set')
const lensProp          = require('ramda/src/lensProp')

module.exports.appendQuery = (url, obj) => {
    const uri = parse(url, true)
    const query = merge(obj, uri.query)
    const newUri = set(lensProp('query'), query, uri)
    
    return format(newUri)
}
