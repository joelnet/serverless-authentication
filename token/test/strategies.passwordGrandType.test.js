const config = require('config')
const test = require('tape')
const strategy = require('../strategies/passwordGrantType')

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

const actions = {
    getUser: (realm, username) =>
        Promise.resolve(
            realm === 'realm' && username == 'username'
                ? { username, password: '$2a$10$wPxFuUCZ1bv3XU0jw.EPceArhxw1lFbX8n/qW0c.z6cFcANZF1IHy' }
                : null),
    readFile: file =>
        file === config.get('certs.privateKey') ? Promise.resolve(privateKey)
      : file === config.get('certs.publicKey')  ? Promise.resolve(publicKey)
                                                : Promise.reject('invalid file')
}

const parseToken = token => {
    const split = token.split('.')

    return [split[0], split[1]]
        .map(x => (new Buffer(x, 'base64').toString()))
        .map(JSON.parse)
}

test('strategies.passwordGrantType.test with invalid grant_type fails', t => {
    t.plan(1)
    const expected = false

    const result = strategy.test(null)

    t.equal(result, expected, 'test should return false')
})

test('strategies.passwordGrantType.test with other grant_type fails', t => {
    t.plan(1)
    const expected = false

    const state = {
        props: { grant_type: 'other' }
    }

    const result = strategy.test(state)

    t.equal(result, expected, 'test should return false')
})

test('strategies.passwordGrantType.test with password grant_type succeeds', t => {
    t.plan(1)
    const expected = true

    const state = {
        props: { grant_type: 'password' }
    }

    const result = strategy.test(state)

    t.equal(result, expected, 'test should return true')
})

test('strategies.passwordGrantType.run with missing user fails', t => {
    t.plan(1)
    const expected = 'User not found'

    const state = {
        props: {
            grant_type: 'password',
            realm: 'realm',
            username: 'bad-username',
        },
        logs: [],
        actions
    }

    strategy.run(state)
        .catch(actual => {
            t.equal(actual, expected, expected)
        })
})

test('strategies.passwordGrantType.run with bad password', t => {
    t.plan(1)

    const expected = 'Password does not match'
    const state = {
        props: {
            grant_type: 'password',
            realm: 'realm',
            username: 'username',
            password: 'BAD-PASSWORD'
        },
        logs: [],
        actions
    }

    strategy.run(state)
        .catch(actual => {
            t.equal(actual, expected, expected)
        })
})


test('strategies.passwordGrantType.run succeeds', t => {
    t.plan(19)

    const state = {
        props: {
            grant_type: 'password',
            realm: 'realm',
            username: 'username',
            password: 'password'
        },
        logs: [],
        actions
    }

    strategy.run(state)
        .then(response => {
            t.ok(response.token, 'token must exist')
            t.ok(response.token.access_token, 'token must contain access_token')
            t.ok(response.token.id_token, 'token must contain id_token')
            t.ok(response.token.refresh_token, 'token must contain refresh_token')

            const access_token = parseToken(response.token.access_token)
            const refresh_token = parseToken(response.token.refresh_token)
            const id_token = parseToken(response.token.id_token)

            t.equal(access_token[0].alg, 'RS256', 'alg must equal RS256')
            t.equal(access_token[0].typ, 'JWT', 'typ must equal JWT')
            t.equal(access_token[1].typ, 'Bearer', 'typ must equal Bearer')
            t.equal(access_token[1].realm, 'realm', 'realm must equal realm')
            t.equal(access_token[1].sub, 'username', 'sub must equal username')

            t.equal(refresh_token[0].alg, 'RS256', 'alg must equal RS256')
            t.equal(refresh_token[0].typ, 'JWT', 'typ must equal JWT')
            t.equal(refresh_token[1].typ, 'Refresh', 'typ must equal Refresh')
            t.equal(refresh_token[1].realm, 'realm', 'realm must equal realm')
            t.equal(refresh_token[1].sub, 'username', 'sub must equal username')

            t.equal(id_token[0].alg, 'RS256', 'alg must equal RS256')
            t.equal(id_token[0].typ, 'JWT', 'typ must equal JWT')
            t.equal(id_token[1].typ, 'ID', 'typ must equal ID')
            t.equal(id_token[1].realm, 'realm', 'realm must equal realm')
            t.equal(id_token[1].sub, 'username', 'sub must equal username')
        })
})
