const path = require('ramda/src/path')

/* istanbul ignore next */
module.exports.first = func => function () {
    return func.apply(this, arguments)
        .then(path(['Items', 0]))
}
