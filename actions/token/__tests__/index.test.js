const config = require('config')
const path = require('ramda/src/path')
const token = require('../index')
const querystring = require('querystring')
const jwt = require('jsonwebtoken')

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
const expiredRefreshToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXAiOiJSZWZyZXNoIiwicmVhbG0iOiJyZWFsbSIsImF1ZCI6ImNsaWVudF9pZCIsInN1YiI6InVzZXJuYW1lIiwiZXhwIjoxNDk0NDA0MjM3LCJpYXQiOjE0OTQ0MDQyMzd9.bPF4Gniy-gOzK5Gk8SNi0tKYxc_Mv0uFH0r9QSgn9ClubAlG3c8zSYZBzXEJFuBuQE5489-i4DvA2_AEBm1IsztY446NCtfsgNsHpanvG43zG_x5lpNc2aGSTlgJQF_g4DXSxJDW0JdJ9gfcQhwRlGhdVk0wO2QEx3c9V5OIMW1oEeqa-vogzRBTCVTKVZVrNz24bC3nbQF21k3gHQfFCWJR-cjsmf1XIt8hOcvqRvwfxHFRHOdwfqihuguIKTQKGj_MFqM9OTeDeakFjeJi16rVSUzoCQOurul7ajZ1IwenDntsqT5EmlFBz1XBkOF16Wj3vNsLyHpI3Rf38GpmXw'

const getUser = () => ({
    password: '$2a$10$wPxFuUCZ1bv3XU0jw.EPceArhxw1lFbX8n/qW0c.z6cFcANZF1IHy'
})

const log = {
    debug: () => null,
    info: () => null,
    error: () => null,
}

const readFile = file =>
    file === config.get('certs.privateKey') ? Promise.resolve(privateKey)
  : file === config.get('certs.publicKey') ? Promise.resolve(publicKey)
      : Promise.reject('invalid file')

describe('actions.token', () => {
    test('with no grant_type fails', () => {
        expect.assertions(1)

        const request = {}
        const mocks = { getUser: () => Promise.resolve(null) }

        return token(request, mocks)
            .catch(err => expect(err).toBe('[400] "grant_type" is required'))
    })

    test('with invalid grant_type fails', () => {
        expect.assertions(1)

        const request = {
            body: querystring.stringify({
                grant_type: 'INVALID'
            })
        }
        const mocks = { getUser: () => Promise.resolve(null) }

        return token(request, mocks)
            .catch(err => expect(err).toBe('[400] "grant_type" must be one of [password, refresh_token]'))
    })

    test('with no client_id fails', () => {
        expect.assertions(1)

        const request = {
            pathParameters: { realm: 'realm' },
            body: querystring.stringify({
                grant_type: 'password'
            })
        }
        const mocks = { getUser: () => Promise.resolve(null) }

        return token(request, mocks)
            .catch(err => expect(err).toBe('[400] "client_id" is required'))
    })

    test('[password] with no username fails', () => {
        expect.assertions(1)

        const request = {
            pathParameters: { realm: 'realm' },
            body: querystring.stringify({
                grant_type: 'password',
                client_id: 'client_id'
            })
        }
        const mocks = {
            getUser: () => Promise.resolve(null),
            log,
        }

        return token(request, mocks)
            .catch(err => expect(err).toBe('[400] "username" is required'))
    })

    test('[password] with no password fails', () => {
        expect.assertions(1)

        const request = {
            pathParameters: { realm: 'realm' },
            body: querystring.stringify({
                grant_type: 'password',
                client_id: 'client_id',
                username: 'username'
            })
        }
        const mocks = { getUser: () => Promise.resolve(null) }

        return token(request, mocks)
            .catch(err => expect(err).toBe('[400] "password" is required'))
    })

    test('[password] with invalid password fails', () => {
        expect.assertions(1)

        const request = {
            pathParameters: { realm: 'realm' },
            body: querystring.stringify({
                grant_type: 'password',
                client_id: 'client_id',
                username: 'username',
                password: 'BAD PASSWORD'
            })
        }
        const mocks = {
            getUser: () => Promise.resolve(getUser()),
            readFile: () => Promise.resolve(privateKey),
            log,
        }

        return token(request, mocks)
            .catch(err => expect(err).toBe('[401] access_denied'))
    })

    test('[password] with no user fails', () => {
        expect.assertions(1)

        const request = {
            pathParameters: { realm: 'realm' },
            body: querystring.stringify({
                grant_type: 'password',
                client_id: 'client_id',
                username: 'username',
                password: 'password'
            })
        }
        const mocks = {
            getUser: () => Promise.resolve(null),
            log,
        }

        return token(request, mocks)
            .catch(err => expect(err).toBe('[401] access_denied'))
    })

    test('[password] with valid password returns tokens', () => {
        expect.assertions(3)

        const request = {
            pathParameters: { realm: 'mojo:default' },
            body: querystring.stringify({
                grant_type: 'password',
                client_id: 'client_id',
                username: 'username',
                password: 'password'
            })
        }
        const mocks = {
            getUser: () => Promise.resolve(getUser()),
            readFile: () => Promise.resolve(privateKey),
            log: {
                info: () => null,
                debug: () => null,
                error: () => null,
            }
        }

        return token(request, mocks)
            .then(token => {
                const decodedAccessToken = jwt.decode(token.access_token)
                const decodedIdToken = jwt.decode(token.id_token)
                const decodedRefreshToken = jwt.decode(token.refresh_token)

                expect(decodedAccessToken.typ).toBe('Bearer')
                expect(decodedIdToken.typ).toBe('ID')
                expect(decodedRefreshToken.typ).toBe('Refresh')
            })
    })

    test('[password] with db error fails', () => {
        expect.assertions(1)

        const request = {
            pathParameters: { realm: 'realm' },
            body: querystring.stringify({
                grant_type: 'password',
                client_id: 'client_id',
                username: 'username',
                password: 'password'
            })
        }
        const mocks = {
            getUser: () => Promise.reject('Uh Oh!'),
            log,
        }

        return token(request, mocks)
            .catch(err => expect(err).toBe('[500] server_error'))
    })

    test('[password] with refresh_token fails', () => {
        expect.assertions(1)

        const request = {
            pathParameters: { realm: 'realm' },
            body: querystring.stringify({
                grant_type: 'password',
                client_id: 'client_id',
                username: 'username',
                password: 'password',
                refresh_token: 'refresh_token'
            })
        }
        const mocks = { getUser: () => Promise.resolve(null) }

        return token(request, mocks)
            .catch(err => expect(err).toBe('[400] "refresh_token" is not allowed'))
    })

    test('[refresh_token] with no refresh_token fails', () => {
        expect.assertions(1)

        const request = {
            pathParameters: { realm: 'realm' },
            body: querystring.stringify({
                grant_type: 'refresh_token',
                client_id: 'client_id'
            })
        }
        const mocks = { getUser: () => Promise.resolve(null) }

        return token(request, mocks)
            .catch(err => expect(err).toBe('[400] "refresh_token" is required'))
    })

    test('[refresh_token] with username fails', () => {
        expect.assertions(1)

        const request = {
            pathParameters: { realm: 'realm' },
            body: querystring.stringify({
                grant_type: 'refresh_token',
                client_id: 'client_id',
                username: 'username',
                refresh_token: 'refresh_token'
            })
        }
        const mocks = { getUser: () => Promise.resolve(null) }

        return token(request, mocks)
            .catch(err => expect(err).toBe('[400] "username" is not allowed'))
    })

    test('[refresh_token] with password fails', () => {
        expect.assertions(1)

        const request = {
            pathParameters: { realm: 'realm' },
            body: querystring.stringify({
                grant_type: 'refresh_token',
                client_id: 'client_id',
                password: 'password',
                refresh_token: 'refresh_token'
            })
        }
        const mocks = { getUser: () => Promise.resolve(null) }

        return token(request, mocks)
            .catch(err => expect(err).toBe('[400] "password" is not allowed'))
    })

    test('[refresh_token] with invalid token fails', () => {
        expect.assertions(1)

        const request = {
            pathParameters: { realm: 'realm' },
            body: querystring.stringify({
                grant_type: 'refresh_token',
                client_id: 'client_id',
                refresh_token: 'refresh_token'
            })
        }
        const mocks = {
            readFile,
            log,
        }

        return token(request, mocks)
            .catch(err => expect(err).toBe('[400] invalid_request'))
    })

    test('[refresh_token] with valid token succeeds', () => {
        expect.assertions(1)

        const request = {
            pathParameters: { realm: 'mojo:default' },
            body: querystring.stringify({
                grant_type: 'refresh_token',
                client_id: 'client_id',
                refresh_token: foreverRefreshToken,
            })
        }
        const mocks = {
            readFile, log
        }

        return token(request, mocks)
            .then(token => expect(token.access_token).toBeTruthy())
    })

    test('with redirect_uri redirects', () => {
        expect.assertions(3)

        const request = {
            pathParameters: { realm: 'realm' },
            body: querystring.stringify({
                grant_type: 'refresh_token',
                client_id: 'client_id',
                refresh_token: foreverRefreshToken,
                redirect_uri: 'http://mock-redirect-uri.com/page'
            })
        }
        const mocks = {
            readFile, log
        }

        return token(request, mocks)
            .then(response => {
                expect(response.statusCode).toBe(302)
                expect(path(['headers', 'Location'], response)).toBe('http://mock-redirect-uri.com/page')
                expect(response.body).toBe('')
            })
            .catch(err => console.log('!!!!!!!!', err))
    })

    test('with expired token returns access_denied', () => {
        expect.assertions(1)

        const request = {
            pathParameters: { realm: 'realm' },
            body: querystring.stringify({
                grant_type: 'refresh_token',
                client_id: 'client_id',
                refresh_token: expiredRefreshToken,
                redirect_uri: 'http://mock-redirect-uri.com/page'
            })
        }
        const mocks = {
            readFile, log
        }

        return token(request, mocks)
            .catch(err => expect(err).toBe('[401] access_denied'))
    })
})
