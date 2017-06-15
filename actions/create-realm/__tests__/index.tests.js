const querystring = require('querystring')
const createRealm = require('..')
const R = require('ramda')

const access_token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzYmRhYjE3Yy04ZThhLTQ3NmItOTIzZS05N2E0NGY2MDhhZjQiLCJ0eXAiOiJCZWFyZXIiLCJyZWFsbSI6Im1vam86ZGVmYXVsdCIsInJvbGVzIjpbXSwiaWF0IjoxNDk3MzQzODc0LCJleHAiOjQ2NTMxMDM4NzQsImF1ZCI6ImRlZmF1bHQiLCJzdWIiOiJ1c2VybmFtZSJ9.XHgiltVcFFgFhqVGxBfwuk2FdFqk1QTm9mJa6IS81h5M5ycrkk3J9FXyc3ONiw80Qhx5lq3WDmNGremoynXboaPHWQFYKFZXBbaFhkK6G-uxMkQl3685ileHCpRSaMcw6X0yiFNWyO5fd-OsozGlVrnahyKenNCxVAJZae2QH0rYgKWlbLATv6kB08L0UZrnP2MSJ_KKZ6Iaz4hKiKlBezMlpz76gXovMNOEztd_WjsL8xz88LLBLwn3IqykW3guS8InOEtt8Ou5SFL37dnwDlP8Od-NoGiTiof6UzAugu1lxoyBbd0iAYjxvcao9sWIwClIbxFxsdHeV2hv7CJbDQ'
const invalidRealmRefreshToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3NzQwNmE4MC1mMGJjLTQ1ZGQtYmIwNy0wYjUyOTkxYzU5ZWUiLCJ0eXAiOiJSZWZyZXNoIiwicmVhbG0iOiJpbnZhbGlkIiwiaWF0IjoxNDk3NTE4MDU3LCJleHAiOjQ2NTMyNzgwNTcsImF1ZCI6ImNsaWVudF9pZCIsInN1YiI6Im1vam8ifQ.kvX_lueA5-sQEe3w6nUirhf70pNAo1MdJdTtDo5XQoJeQ0VMlqyG70TGv7j99UxW3Sn0AkRYvYoBIWwnYgzS7lT7HGdnDZW3QVy3fNCdJgGe8SlhKU1luJmheatPbSBN8k5FIsXJTZ4jS8iv9IcBJ2zl_Fv7YVdawGcrgmWjuKz70KS7wIcqT9kffIFppOjlqzutQ3r7NiTPyBfl2Qd35RdAgHSHUV3HQWNo6ntgPg0TLwQ7BC-iUxqecO_6IW8JWdV5-iyzkuRiiudyZ1FBorGOLyPebcQ1aLxlWdiAPCOQ70TgwRnqPNZmAu43EQrnBT6XoT3r-3QU3AAJXoI4kg'
const anotherUserRefreshToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1MjA2ZDY2MS0wNWZiLTRmOWQtOWEzZC04ZjFhNWM3MTZiNTciLCJ0eXAiOiJSZWZyZXNoIiwicmVhbG0iOiJtb2pvOmRlZmF1bHQiLCJpYXQiOjE0OTc1MTY2MTIsImV4cCI6NDY1MzI3NjYxMiwiYXVkIjoiY2xpZW50X2lkIiwic3ViIjoidXNlcm5hbWUifQ.cMXo72f-3qoGQRaKt3Su4xqhBHQDHYZnWnVKzl-iBDaU8Hm9fBdihvlHroN-DB2SwVCSXhw2v2gq6DtXC4b7bmBG9VhiF3v7HtPfY0GJN6otCUVnQtV2quBS4-JxxxzeF6ie4hhKqnKAPwO7-qUdbaXc7codYYzYb-C5C3mSrjrTk-ipu_g32GTHjiXrdYCGZvH7v9S-dkcRyVM0CEChye4vCk_uffgIOb9xWgwwhqQkWuGmF89MF6EIdo8yihtTt3Xx_cW8-N4S5BBQDSXyxzfbYG1rkUSx-ADsdI5r86a7vqYkmaZldpmHaWqGeHTD5oV-aLocfSKA6bcSfV9v9g'
const refreshToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4NWE4OGRmZC03ZjlmLTRkNDktOTcyNS0wMzFjNGI5YzZhNzMiLCJ0eXAiOiJSZWZyZXNoIiwicmVhbG0iOiJtb2pvOmRlZmF1bHQiLCJpYXQiOjE0OTc1MTcwNTksImV4cCI6NDY1MzI3NzA1OSwiYXVkIjoiY2xpZW50X2lkIiwic3ViIjoibW9qbyJ9.Sy82pm-IFqLTCuDqcx_zezNMGyyS9rZA8AmxH5K25YheovC7g_Yl8lQdh5-jk_zXiElYcMUnsijT4IVo7ENZ7LsWO0_VwhrThepFMl0BHyQAiHBEmR1HoKpGJfjpBrDL9D45a6bpw_t40aJCXbAiUkTD5f1hBPYio5Jw1eZPUvuo-UDhqvPSFz1dhgomV5cbXYXaipCK24oVKMS1Snf1gqSdhVqwN6usz9b6U1NYSEfIErdHhDkaQmIKFGItB4VoDQmVcG0OzI3DwwAvoQv9da3CQy2rq2HpM4mIHPaWWK1ihfBGQ7gOHso4fe35xMDzdov4cZ5U_wnCkNXYqEoVqQ'
//const foreverRefreshToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkZDJiZjZkOC0xYmJmLTRmMWMtODkwOC01OGQ4YjBkZTk1MTIiLCJ0eXAiOiJSZWZyZXNoIiwicmVhbG0iOiJtb2pvOmRlZmF1bHQiLCJpYXQiOjE0OTc1MTQxNzIsImV4cCI6MTQ5NzUxNTk3MiwiYXVkIjoiY2xpZW50X2lkIiwic3ViIjoidXNlcm5hbWUifQ.KXTKsizvYxGaRdSTcuGEe-AWgdx7RMuxMzWOfdp9nAzJZe4ko-h8McvTUxaeApbWsZ8VixJCu3HlHMeMjZbWgzuALy7vbEW2jnDf0d274rIUJw2a_n_2LnIYYUmtH10F6IUcJrut9M-s6ST5q7zvmpW6HtMmOMdGJcmx2GSy-5L8-k9fVhCIFLUD3HKM70ilxLCJLvUloWbtkQE3a_ydfy4xvLucOhMS8qnhZ8BvzFtHcHwl-rdPkLZeW2SeHa3TyBhlrs12zki8BdczbgYbGJ2pUlVOFfY0g69sxrLXIny-bEv-cr3H8b0jExAwESEMWlGdsAAvdymLuLzAm7ZK2A'

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
    readFile: () => Promise.resolve(publicKey),
    createRealm: realm => Promise.resolve(realm),
    // getRealm: realm =>
    //     Promise.resolve(realm === 'demo' ? { realmId: 'demo', auth_uri: 'http://auth.uri/demo/login' } : null),
    log: {
        debug: () => null,
        info: () => null,
        error: () => null,
    },
}

describe('create-realm', () => {
    test('no realm fails', () => {
        expect.assertions(1)

        const request = {}

        return createRealm(request, actions)
            .catch(err => expect(err).toBe('[400] "realm" is required'))
    })

    test('no access_token fails', () => {
        expect.assertions(1)

        const request = {
            pathParameters: { realm: 'realm' },
        }

        return createRealm(request, actions)
            .catch(err => expect(err).toBe('[400] "access_token" is required'))
    })

    test('invalid access_token returns jwt malformed', () => {
        expect.assertions(2)

        const request = {
            pathParameters: { realm: 'realm' },
            body: querystring.stringify({
                access_token: 'access_token',
            })
        }

        const myActions = R.set(R.lensPath(['log', 'error']), err => {
            expect(err).toMatch(/JsonWebTokenError: jwt malformed/)
        }, actions)

        return createRealm(request, myActions)
            .catch(err => expect(err).toBe('[500] server_error'))
    })

    test('non default realm returns Not Authorized', () => {
        expect.assertions(2)

        const request = {
            pathParameters: { realm: 'mojo:default' },
            body: querystring.stringify({
                access_token: invalidRealmRefreshToken,
            })
        }

        const myActions = R.set(R.lensPath(['log', 'error']), err => {
            expect(err).toBe('Not Authorized')
        }, actions)

        return createRealm(request, myActions)
            .catch(err => expect(err).toBe('[500] server_error'))
    })

    test('invalid realm returns Not Authorized', () => {
        expect.assertions(2)

        const request = {
            pathParameters: { realm: 'mojo:default' },
            body: querystring.stringify({
                access_token: anotherUserRefreshToken,
            })
        }

        const myActions = R.set(R.lensPath(['log', 'error']), err => {
            expect(err).toBe('Not Authorized')
        }, actions)

        return createRealm(request, myActions)
            .catch(err => expect(err).toBe('[500] server_error'))
    })

    test('user doesn\'t own realm returns Not Authorized', () => {
        expect.assertions(2)

        const request = {
            pathParameters: { realm: 'mojo:default' },
            body: querystring.stringify({
                access_token: invalidRealmRefreshToken,
            })
        }

        const myActions = R.set(R.lensPath(['log', 'error']), err => {
            expect(err).toBe('Not Authorized')
        }, actions)

        return createRealm(request, myActions)
            .catch(err => expect(err).toBe('[500] server_error'))
    })

    test('realm already exists return [409] Realm already exists', () => {
        expect.assertions(1)

        const request = {
            pathParameters: { realm: 'mojo:default' },
            body: querystring.stringify({
                access_token: refreshToken,
            })
        }

        const myActions = Object.assign({}, actions, {
            createRealm: realm => Promise.reject('Realm already exists')
        })

        return createRealm(request, myActions)
            .catch(err => expect(err).toBe('[409] Realm already exists'))
    })

    test('user creates realm', () => {
        expect.assertions(1)

        const request = {
            pathParameters: { realm: 'mojo:default' },
            body: querystring.stringify({
                access_token: refreshToken,
            })
        }

        return createRealm(request, actions)
            .then(data => expect(data).toEqual({ owner: 'mojo', realmId: 'mojo:default' }))
    })
})
