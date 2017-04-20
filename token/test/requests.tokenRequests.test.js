const test = require('tape')
const validate = require('../requests/tokenRequest')

test('requests/tokenRequest with no object returns grant_type error', t => {
    t.plan(1)
    const data = {}
    
    validate()(data)
        .catch(error => t.equal(error, '"grant_type" is required', '"grant_type" is required'))
})

test('requests/tokenRequest with no realm returns realm error', t => {
    t.plan(1)
    const data = {
        grant_type: 'password'
    }

    validate()(data)
        .catch(error => t.equal(error, '"realm" is required', '"realm" is required'))
})

test('requests/tokenRequest with no client_id returns realm error', t => {
    t.plan(1)
    const data = {
        grant_type: 'password',
        path: { realm: 'realm' }
    }

    validate()(data)
        .catch(error => t.equal(error, '"client_id" is required', '"client_id" is required'))
})

test('requests/tokenRequest with grant_type=password and no username returns username error', t => {
    t.plan(1)
    const data = {
        grant_type: 'password',
        path: { realm: 'realm' },
        client_id: 'client_id'
    }

    validate()(data)
        .catch(error => t.equal(error, '"username" is required', '"username" is required'))
})

test('requests/tokenRequest with grant_type=password and no password returns password error', t => {
    t.plan(1)
    const data = {
        grant_type: 'password',
        path: { realm: 'realm' },
        client_id: 'client_id',
        username: 'username'
    }

    validate()(data)
        .catch(error => t.equal(error, '"password" is required', '"password" is required'))
})

test('requests/tokenRequest with grant_type=password and refresh_token returns refresh_token error', t => {
    t.plan(1)
    const data = {
        grant_type: 'password',
        path: { realm: 'realm' },
        client_id: 'client_id',
        username: 'username',
        password: 'password',
        refresh_token: 'refresh_token'
    }

    validate()(data)
        .catch(error => t.equal(error, '"refresh_token" is not allowed', '"refresh_token" is not allowed'))
})

test('requests/tokenRequest with grant_type=password returns success', t => {
    t.plan(1)
    const data = {
        grant_type: 'password',
        path: { realm: 'realm' },
        client_id: 'client_id',
        username: 'username',
        password: 'password'
    }

    validate(x => x)(data)
        .then(data => t.ok(data, 'should be success'))
})

test('requests/tokenRequest with grant_type=refresh_token and no refresh_token returns refresh_token error', t => {
    t.plan(1)
    const data = {
        grant_type: 'refresh_token',
        path: { realm: 'realm' },
        client_id: 'client_id'
    }

    validate()(data)
        .catch(error => t.equal(error, '"refresh_token" is required', '"refresh_token" is required'))
})

test('requests/tokenRequest with grant_type=refresh_token and username returns username error', t => {
    t.plan(1)
    const data = {
        grant_type: 'refresh_token',
        path: { realm: 'realm' },
        client_id: 'client_id',
        username: 'username'
    }

    validate()(data)
        .catch(error => t.equal(error, '"username" is not allowed', '"username" is not allowed'))
})

test('requests/tokenRequest with grant_type=refresh_token and password returns password error', t => {
    t.plan(1)
    const data = {
        grant_type: 'refresh_token',
        path: { realm: 'realm' },
        client_id: 'client_id',
        password: 'password'
    }

    validate()(data)
        .catch(error => t.equal(error, '"password" is not allowed', '"password" is not allowed'))
})

test('requests/tokenRequest with grant_type=refresh_token returns success', t => {
    t.plan(1)
    const data = {
        grant_type: 'refresh_token',
        path: { realm: 'realm' },
        client_id: 'client_id',
        refresh_token: 'refresh_token'
    }

    validate(x => x)(data)
        .then(data => t.ok(data, 'should return success'))
})

test('requests/tokenRequest calls func', t => {
    t.plan(1)
    const data = {
        grant_type: 'refresh_token',
        path: { realm: 'realm' },
        client_id: 'client_id',
        refresh_token: 'refresh_token'
    }

    validate(data => t.ok(data, 'should return success'))(data)
})
