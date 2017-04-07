const test = require('tape')
const token = require('../../services/token')

const getUser = () => ({
    password: '$2a$10$wPxFuUCZ1bv3XU0jw.EPceArhxw1lFbX8n/qW0c.z6cFcANZF1IHy'
})

test('services/token with no grant_type fails', t => {
    t.plan(1)

    const request = undefined
    const mocks = { getUser: () => Promise.resolve(null) }
    
    token(request, mocks)
        .catch(err => t.equal(err, '"grant_type" is required', '"grant_type" is required'))
})

test('services/token with invalid grant_type fails', t => {
    t.plan(1)

    const request = {
            grant_type: 'INVALID'
        }
    const mocks = { getUser: () => Promise.resolve(null) }

    token(request, mocks)
        .catch(err => t.equal(err, '"grant_type" must be one of [password, refresh_token]', '"grant_type" must be one of [password, refresh_token]'))
})

test('services/token with no client_id fails', t => {
    t.plan(1)
    
    const request = {
            path: { realm: 'realm' },
            grant_type: 'password'
        }
    const mocks = { getUser: () => Promise.resolve(null) }

    token(request, mocks)
        .catch(err => t.equal(err, '"client_id" is required', '"client_id" is required'))
})

test('services/token [password] with no username fails', t => {
    t.plan(1)
    
    const request = {
            path: { realm: 'realm' },
            grant_type: 'password',
            client_id: 'client_id'
        }
    const mocks = { getUser: () => Promise.resolve(null) }

    token(request, mocks)
        .catch(err => t.equal(err, '"username" is required', '"username" is required'))
})

test('services/token [password] with no password fails', t => {
    t.plan(1)
    
    const request = {
            path: { realm: 'realm' },
            grant_type: 'password',
            client_id: 'client_id',
            username: 'username'
        }
    const mocks = { getUser: () => Promise.resolve(null) }

    token(request, mocks)
        .catch(err => t.equal(err, '"password" is required', '"password" is required'))
})

test('services/token [password] with invalid password fails', t => {
    t.plan(1)

    const request = {
            path: { realm: 'realm' },
            grant_type: 'password',
            client_id: 'client_id',
            username: 'username',
            password: 'BAD PASSWORD'
        }
    const mocks = { getUser: () => Promise.resolve(getUser()) }

    token(request, mocks)
        .catch(err => t.equal(err, '[401] Login Failed', '[401] Login Failed'))
})

test('services/token [password] with no user fails', t => {
    t.plan(1)

    const request = {
            path: { realm: 'realm' },
            grant_type: 'password',
            client_id: 'client_id',
            username: 'username',
            password: 'password'
        }
    const mocks = { getUser: () => Promise.resolve(null) }

    token(request, mocks)
        .catch(err => t.equal(err, '[401] Login Failed', '[401] Login Failed'))
})

test('services/token [password] with valid password succeeds', t => {
    t.plan(1)

    const request = {
            path: { realm: 'realm' },
            grant_type: 'password',
            client_id: 'client_id',
            username: 'username',
            password: 'password'
        }
    const mocks = { getUser: () => Promise.resolve(getUser()) }

    token(request, mocks)
        .then(token => t.ok(token))
})

test('services/token [password] with db error fails', t => {
    t.plan(1)

    const request = {
            path: { realm: 'realm' },
            grant_type: 'password',
            client_id: 'client_id',
            username: 'username',
            password: 'password'
        }
    const mocks = { getUser: () => Promise.reject('Uh Oh!') }

    token(request, mocks)
        .catch(err => t.equal(err, '[500] Unknown Error', '[500] Unknown Error'))
})

test('services/token [password] with no user fails', t => {
    t.plan(1)

    const request = {
            path: { realm: 'realm' },
            grant_type: 'password',
            client_id: 'client_id',
            username: 'username',
            password: 'password'
        }
    const mocks = { getUser: () => Promise.resolve(null) }

    token(request, mocks)
        .catch(err => t.equal(err, '[401] Login Failed', '[401] Login Failed'))
})

test('services/token [password] with refresh_token fails', t => {
    t.plan(1)

    const request = {
            path: { realm: 'realm' },
            grant_type: 'password',
            client_id: 'client_id',
            username: 'username',
            password: 'password',
            refresh_token: 'refresh_token'
        }
    const mocks = { getUser: () => Promise.resolve(null) }

    token(request, mocks)
        .catch(err => t.equal(err, '"refresh_token" is not allowed', '"refresh_token" is not allowed'))
})

test('services/token [refresh_token] with no refresh_token fails', t => {
    t.plan(1)

    const request = {
            path: { realm: 'realm' },
            grant_type: 'refresh_token',
            client_id: 'client_id'
        }
    const mocks = { getUser: () => Promise.resolve(null) }

    token(request, mocks)
        .catch(err => t.equal(err, '"refresh_token" is required', '"refresh_token" is required'))
})

test('services/token [refresh_token] with username fails', t => {
    t.plan(1)

    const request = {
            path: { realm: 'realm' },
            grant_type: 'refresh_token',
            client_id: 'client_id',
            username: 'username',
            refresh_token: 'refresh_token'
        }
    const mocks = { getUser: () => Promise.resolve(null) }

    token(request, mocks)
        .catch(err => t.equal(err, '"username" is not allowed', '"username" is not allowed'))
})

test('services/token [refresh_token] with password fails', t => {
    t.plan(1)

    const request = {
            path: { realm: 'realm' },
            grant_type: 'refresh_token',
            client_id: 'client_id',
            password: 'password',
            refresh_token: 'refresh_token'
        }
    const mocks = { getUser: () => Promise.resolve(null) }

    token(request, mocks)
        .catch(err => t.equal(err, '"password" is not allowed', '"password" is not allowed'))
})

// test('services/token [refresh_token] return success', t => {
//     t.plan(1)

//     const request = {
//             path: { realm: 'realm' },
//             grant_type: 'refresh_token',
//             client_id: 'client_id',
//             refresh_token: 'refresh_token'
//         }
//     const mocks = { getUser: () => Promise.resolve(null) }

//     token(request, mocks)
//         .catch(err => t.equal(err, 'TODO: write code', 'should not have error'))
// })
