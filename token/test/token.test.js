const config = require('config')
const test   = require('tape')
const token  = require('../token')

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEApU4JW+EgeFUZG2hI3n7C0x8/gSerp1Ga90JOTkeH9+KL+FU/wankZCBx
cHp/NgBlbuvdrdD8/Ym3CYwNiqC7CETztkXPRI4hWG2Z/eYZ4D9GKnxFviAAJ4TNr7esWjN7
s12wnoD4KM5I9agKHobMGMPbiifOeYtgj2mVrkqlowlgw/WnpcPjXCnEXt6fns3LRPpsmruI
uCX3G4P9Sv+D3BK/RWSjXtfohmTLdo7mfg9fDJAv3I9N93kD1zZXanpQJE5UjmuUzpMtHW20
2rxib5Y412Ds0qKC5AtgfM9BTUIaz9KVP2Y9YXgM6QdOL2zgNJHJUE7sUIw36fJ258FM2wID
AQABAoIBAGEfJV6HOdWZYgP5VH7tCTiTrnMKxM6sopjNq0ZQvrFEuKoyJCB72gV+DkhgoGcw
+meeSwN5u3qXNCR21enyH5FvOaWJBIsp2qui0Ywcam2Xn3kMxMk88fpGC7dG+guRHge3bzLh
YWxQLwuuLCvdVQLj6BQW6Tf+TMBV76yUjRbpT0cXzQM9HHSlRZwmGFQ137agAfEXnA2gBVCk
UkNDaS4DOeNEKgR5GstUCM3AKrv9HbYr3uUyUzRmpnISJQt6lU5/eoqa0+BDwNVCHTjEQjVq
VROwcr/uUtiCgMN8Up8mpBmdYP+QhBO/2GCtHzkqL3iawyx/Dlqg+fACxzwrUhkCgYEA/yR0
UxxaS9wQsNHrtBwgtCs9pq2W5QwRaGqe4Zkvw+KCjAa069SUolAFHG8W2J4P0lFzzRnu+ETj
qjpHPggZQYfx+XVCluYP7bKN20yRPi0EhKscZjX7xStTyI4r7YKp737HuYRjHBsWtLYYGPRM
rS8OvK5manin9NDD+3LoFg8CgYEApdxHS3zn5SgFRoWQfGYembGGMtdYgNNupRC98UzIhSIH
qS3aIeX6VPnOo7HnM0xc6OdTeznrLJJmJ0ksI129r2rN6xxQ0dkeBGfKNK/cH+F/ZbGsOChB
er7srgnZhLbmXELTI9IIUyghUZmmdEbTC8iXG/tqUDHMBJiU7w3VSHUCgYEAzl+cP8WFPCsK
zRtfPdYqldEMExACJ861HfJwBSa1PgqvcbfTC5Zti0SSfcdVgW2IeqQruNCrPOHsDLsK+R/v
3dOqZA73B7ubUrbEi4fJS7N6Hh2R4RL1TSyYnnZxDbJM5k10G5j72bYHjbBkmXqxsruHfhLL
AIALyrg6bd8p3v0CgYBbkGP7lJUguRtQd2PwiR/TkWGYp7HATPkEP13c3JrGhKbeCuYlWKT+
THp7fDc65qlUGoDHwo3GKXwjrA2l6JZTRQ8xAIzNjKM5o2LJ+1v2bbK7HX8J8Y9UiBp5ag6f
aal6vZl6aPUXk0vxlHWEM6VHGBHz7LQgWZ1b3DA8WNKqEQKBgQDPnXNz8O+SPPaGc92bRNQW
2CPB56qkJm/rPrYTO9N+DBKvALcuZHnujI5ph1wmiUdkSe/k99ihiCk/dncXa8MkBPbf6BmD
0EfrNr2oyMc3yMXz2CRzEh+zDZPCXwFH4C5oZ3vVwO4A8Sm3L9sibJw/FMqAvVWWGw+iRqRo
0IIkAA==
-----END RSA PRIVATE KEY-----`

const publicKey = `-----BEGIN RSA PUBLIC KEY-----
MIIBCgKCAQEApU4JW+EgeFUZG2hI3n7C0x8/gSerp1Ga90JOTkeH9+KL+FU/wankZCBxcHp/
NgBlbuvdrdD8/Ym3CYwNiqC7CETztkXPRI4hWG2Z/eYZ4D9GKnxFviAAJ4TNr7esWjN7s12w
noD4KM5I9agKHobMGMPbiifOeYtgj2mVrkqlowlgw/WnpcPjXCnEXt6fns3LRPpsmruIuCX3
G4P9Sv+D3BK/RWSjXtfohmTLdo7mfg9fDJAv3I9N93kD1zZXanpQJE5UjmuUzpMtHW202rxi
b5Y412Ds0qKC5AtgfM9BTUIaz9KVP2Y9YXgM6QdOL2zgNJHJUE7sUIw36fJ258FM2wIDAQAB
-----END RSA PUBLIC KEY-----`

const foreverRefreshToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NmU1Njk0ZS1mMjViLTQ1MTEtOTM1Zi1mOGM2MzY2NmU3MGYiLCJ0eXAiOiJSZWZyZXNoIiwicmVhbG0iOiJ0ZXN0IiwiaWF0IjoxNDkxOTg1NDEyLCJhdWQiOiJkZWZhdWx0Iiwic3ViIjoidGVzdEB0ZXN0LmNvbSJ9.Gw-y4n9oI6qoCmGzH_vfRT2y94_kuGpADzerSLnyefBkfoNL_DNZ6TeSvsYZ0HlPcIGRW6FE4J6-6K9UXEjxBtSqPmi0sjQ8n1W9yUjJsgvqgf_gajh7Vw0xsE9hpOpKJIvOeVrcQSiKLGXTMYS6_Jk5Jj4pc48e58X3Zc39wqafEvSwZPRGihSmL7B-jrcC7J6X254XgtYS5AyR3ki5d5zvZ-0lHATv-W_DT7n9IrNDrL_iig6HP5nWbm1tdSn0MmJKVMs5BHcx7lRGLjvoIQzni0b6hMxDBxChQTyv8eD4nzh99F5fI7sWKXqirwIjyLFevatt2ujcQVvEUPCA6Q'

const getUser = () => ({
    password: '$2a$10$wPxFuUCZ1bv3XU0jw.EPceArhxw1lFbX8n/qW0c.z6cFcANZF1IHy'
})

const readFile = file =>
    file === config.get('certs.privateKey') ? Promise.resolve(privateKey)
  : file === config.get('certs.publicKey')  ? Promise.resolve(publicKey)
                                            : Promise.reject('invalid file')

const writeLogs = state => Promise.resolve(state)

test('services.token with no grant_type fails', t => {
    t.plan(1)

    const request = undefined
    const mocks = { getUser: () => Promise.resolve(null) }
    
    token(request, mocks)
        .catch(err => t.equal(err, '"grant_type" is required', '"grant_type" is required'))
})

test('services.token with invalid grant_type fails', t => {
    t.plan(1)

    const request = {
            grant_type: 'INVALID'
        }
    const mocks = { getUser: () => Promise.resolve(null) }

    token(request, mocks)
        .catch(err => t.equal(err, '"grant_type" must be one of [password, refresh_token]', '"grant_type" must be one of [password, refresh_token]'))
})

test('services.token with no client_id fails', t => {
    t.plan(1)
    
    const request = {
            path: { realm: 'realm' },
            grant_type: 'password'
        }
    const mocks = { getUser: () => Promise.resolve(null) }

    token(request, mocks)
        .catch(err => t.equal(err, '"client_id" is required', '"client_id" is required'))
})

test('services.token [password] with no username fails', t => {
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

test('services.token [password] with no password fails', t => {
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

test('services.token [password] with invalid password fails', t => {
    t.plan(1)

    const request = {
            path: { realm: 'realm' },
            grant_type: 'password',
            client_id: 'client_id',
            username: 'username',
            password: 'BAD PASSWORD'
        }
    const mocks = {
        getUser: () => Promise.resolve(getUser()),
        readFile: () => Promise.resolve(privateKey)
    }

    token(request, mocks)
        .catch(err => t.equal(err, '[401] Unauthorized', '[401] Unauthorized'))
})

test('services.token [password] with no user fails', t => {
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
        .catch(err => t.equal(err, '[401] Unauthorized', '[401] Unauthorized'))
})

test('services.token [password] with valid password succeeds', t => {
    t.plan(1)

    const request = {
            path: { realm: 'realm' },
            grant_type: 'password',
            client_id: 'client_id',
            username: 'username',
            password: 'password'
        }
    const mocks = {
        getUser: () => Promise.resolve(getUser()),
        readFile: () => Promise.resolve(privateKey)
    }

    token(request, mocks)
        .then(token => t.ok(token))
})

test('services.token [password] with db error fails', t => {
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

test('services.token [password] with no user fails', t => {
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
        .catch(err => t.equal(err, '[401] Unauthorized', '[401] Unauthorized'))
})

test('services.token [password] with refresh_token fails', t => {
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

test('services.token [refresh_token] with no refresh_token fails', t => {
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

test('services.token [refresh_token] with username fails', t => {
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

test('services.token [refresh_token] with password fails', t => {
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

test('services.token [refresh_token] with invalid token fails', t => {
    t.plan(1)

    const request = {
            path: { realm: 'realm' },
            grant_type: 'refresh_token',
            client_id: 'client_id',
            refresh_token: 'refresh_token'
        }
    const mocks = {
        readFile
    }

    token(request, mocks)
        .catch(err => t.equal(err, '[400] Bad Request', '[400] Bad Request'))
})

test('services.token [refresh_token] with valid token succeeds', t => {
    t.plan(1)

    const request = {
            path: { realm: 'realm' },
            grant_type: 'refresh_token',
            client_id: 'client_id',
            refresh_token: foreverRefreshToken,
        }
    const mocks = {
        readFile, writeLogs
    }

    token(request, mocks)
        .then(token => {
            t.ok(token.access_token)
        })
})
