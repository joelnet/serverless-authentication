const SUCCESS = 200
const BAD_REQUEST = 400

const response = (status, body) =>
    ({ status, body: JSON.stringify(body) })

const failResponse = error => {
    const match = /^\[(\d+)\] (.*$)/.exec(error)
    
    return match
        ? response(match[1], match[2])
        : response(BAD_REQUEST, { error })
}

const successResponse = obj =>
    response(SUCCESS, obj)

const withJsonResponse = func => x =>
    func(x)
        .then(successResponse)
        .catch(failResponse)

module.exports = {
    withJsonResponse,
}
