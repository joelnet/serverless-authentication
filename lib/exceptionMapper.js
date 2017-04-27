const BAD_REQUEST = '[400] Bad Request'
const UNAUTHORIZED = '[401] Unauthorized'
const UNKNOWN_ERROR = '[500] Unknown Error'

const map = [
    {
        test: err => ['User not found', 'Password does not match', 'jwt must be provided'].indexOf(err) > -1,
        run: () => UNAUTHORIZED
    },
    {
        test: err => err === 'jwt malformed',
        run: () => BAD_REQUEST
    },
    {
        test: () => true,
        run: () => UNKNOWN_ERROR
    },
]

module.exports = err =>
    map.find(o => o.test(err))
        .run(err)