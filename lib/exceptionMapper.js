const BAD_REQUEST = '[400] invalid_request'
const UNAUTHORIZED = '[401] access_denied'
const NOT_FOUND = '[404] Not Found'
const UNKNOWN_ERROR = '[500] server_error'

const map = [
    {
        test: err => ['Not Found', 'Realm not found'].indexOf(err) > -1,
        run: () => NOT_FOUND
    },
    {
        test: err => ['User not found', 'Password does not match', 'jwt must be provided', 'jwt expired'].indexOf(err) > -1,
        run: () => UNAUTHORIZED
    },
    {
        test: err => ['jwt malformed'].indexOf(err) > -1,
        run: () => BAD_REQUEST
    },
    {
        test: err => ['User already exists'].indexOf(err) > -1,
        run: err => `[403] ${err}`
    },
    {
        test: () => true,
        run: () => UNKNOWN_ERROR
    },
]

module.exports = err =>
    map.find(o => o.test(err))
        .run(err)
