const test = require('tape')
const validateToken = require('../../actions/validateToken')

const publicKey = `-----BEGIN RSA PUBLIC KEY-----
MIIBCgKCAQEApU4JW+EgeFUZG2hI3n7C0x8/gSerp1Ga90JOTkeH9+KL+FU/wankZCBxcHp/
NgBlbuvdrdD8/Ym3CYwNiqC7CETztkXPRI4hWG2Z/eYZ4D9GKnxFviAAJ4TNr7esWjN7s12w
noD4KM5I9agKHobMGMPbiifOeYtgj2mVrkqlowlgw/WnpcPjXCnEXt6fns3LRPpsmruIuCX3
G4P9Sv+D3BK/RWSjXtfohmTLdo7mfg9fDJAv3I9N93kD1zZXanpQJE5UjmuUzpMtHW202rxi
b5Y412Ds0qKC5AtgfM9BTUIaz9KVP2Y9YXgM6QdOL2zgNJHJUE7sUIw36fJ258FM2wIDAQAB
-----END RSA PUBLIC KEY-----`

const expiredRefreshToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxMDUwMGUxNC1kZjE3LTRkYWUtYTZkOC0xMzQwNWI4ZGMwMTQiLCJ0eXAiOiJSZWZyZXNoIiwicmVhbG0iOiJ0ZXN0IiwiaWF0IjoxNDkxOTg2Mjk3LCJleHAiOjE0OTE5ODYyOTgsImF1ZCI6ImRlZmF1bHQiLCJzdWIiOiJ0ZXN0QHRlc3QuY29tIn0.M1yQMDFb2CADzPcSGnPIh7BLjAXT7SIHj3L3s9NUiQS7WNVrCPeQ2FdbMMSatgatDG7n9NhVLth0I6GdWyZbqn81CeRr9l3xxU45Fv8gt5DVW5RjExry7XqkxujFfxot7wI6GkmsKnOazUCHnmBM6CUWQaXZs6y_aQf6K-cDXFH4JevqiRpzVGZQiqvtA1ahD2w62qgydA_r_IRnIp02nFwJ1EUy4tQ7MvTQQW713cUXnVML76mNjJ5bls2RVgIiUc0Cj1MyAj6ajuxiPwN829r1E-V9FPkkhdLAI_FjLUsM_5lGwJssq0bhkFJEzoDNzuchj0St92t6fMaLwnOE3A'
const foreverRefreshToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NmU1Njk0ZS1mMjViLTQ1MTEtOTM1Zi1mOGM2MzY2NmU3MGYiLCJ0eXAiOiJSZWZyZXNoIiwicmVhbG0iOiJ0ZXN0IiwiaWF0IjoxNDkxOTg1NDEyLCJhdWQiOiJkZWZhdWx0Iiwic3ViIjoidGVzdEB0ZXN0LmNvbSJ9.Gw-y4n9oI6qoCmGzH_vfRT2y94_kuGpADzerSLnyefBkfoNL_DNZ6TeSvsYZ0HlPcIGRW6FE4J6-6K9UXEjxBtSqPmi0sjQ8n1W9yUjJsgvqgf_gajh7Vw0xsE9hpOpKJIvOeVrcQSiKLGXTMYS6_Jk5Jj4pc48e58X3Zc39wqafEvSwZPRGihSmL7B-jrcC7J6X254XgtYS5AyR3ki5d5zvZ-0lHATv-W_DT7n9IrNDrL_iig6HP5nWbm1tdSn0MmJKVMs5BHcx7lRGLjvoIQzni0b6hMxDBxChQTyv8eD4nzh99F5fI7sWKXqirwIjyLFevatt2ujcQVvEUPCA6Q'
const foreverIdToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhM2Q5ZmYzMS04ZDZjLTRmZTgtOWFlYi0xMmRjOWYyNzAzMjAiLCJ0eXAiOiJJRCIsInJlYWxtIjoidGVzdCIsInByZWZlcnJlZF91c2VybmFtZSI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE0OTE5ODU4MTMsImF1ZCI6ImRlZmF1bHQiLCJzdWIiOiJ0ZXN0QHRlc3QuY29tIn0.CRwvIWBdXGBCzjnJP0VLQJtHDAIEu3g3bIYkUk_ZQx04TWQBjPl5Cw1mVaozV-bw1GLFnKP0uwXsp_TmSWDl8BM8vXW8xMsZQ2N4wUxrYYmnr8IhKA1o3W30b4drMTCOur18gD4tzlRwPbmytz-gWT27lxpBXe4UHa94MMZJWM1AKzQwA5K29lg8dMjDNuo2ETV7Iqjx-pQzCzaNHo4om4AmNNhm-Bw-qRlcKraiNKoDp3gXP4EJJWoqxGjszuhC17rcFDupBcw9C5BY8ThZ3KPIore4nLbESu5c_HCUQnnMNGm2cOiyV8j2qIULuqu7D9A-icS9isVO5u_6QUfWPA'

test('actions.validateToken with no token fails', t => {
    t.plan(2)

    const state = {
        props: {
        },
        actions: {
            readFile: () => Promise.resolve('INVALID-CERT')
        },
        logs: []
    }

    validateToken(state)
        .catch(err => {
            const errors = err.logs.filter(x => x.type === 'error')
            const debugs = err.logs.filter(x => x.type === 'debug')

            t.equal(errors[0].message, '[400] Bad Request', '[400] Bad Request')
            t.equal(debugs[0].message, 'JsonWebTokenError: jwt must be provided', 'JsonWebTokenError: jwt must be provided')
        })
})

test('actions.validateToken with invalid cert fails', t => {
    t.plan(2)

    const state = {
        props: {
            refresh_token: foreverRefreshToken
        },
        actions: {
            readFile: () => Promise.resolve('INVALID-CERT')
        },
        logs: []
    }

    validateToken(state)
        .catch(err => {
            const errors = err.logs.filter(x => x.type === 'error')
            const debugs = err.logs.filter(x => x.type === 'debug')

            t.equal(errors[0].message, '[500] Unknown Error')
            t.equal(debugs[0].message, 'Error: PEM_read_bio_PUBKEY failed', 'Error: PEM_read_bio_PUBKEY failed')
        })
})

test('actions.validateToken with invalid token fails', t => {
    t.plan(2)

    const state = {
        props: {
            refresh_token: 'INVALID TOKEN'
        },
        actions: {
            readFile: () => Promise.resolve(publicKey)
        },
        logs: []
    }

    validateToken(state)
        .catch(err => {
            const errors = err.logs.filter(x => x.type === 'error')
            const debugs = err.logs.filter(x => x.type === 'debug')

            t.equal(errors[0].message, '[400] Bad Request', '[400] Bad Request')
            t.equal(debugs[0].message, 'JsonWebTokenError: jwt malformed', 'JsonWebTokenError: jwt malformed')
        })
})

test('actions.validateToken with expired access_token fails', t => {
    t.plan(2)

    const state = {
        props: {
            refresh_token: expiredRefreshToken
        },
        actions: {
            readFile: () => Promise.resolve(publicKey)
        },
        logs: []
    }

    validateToken(state)
        .catch(err => {
            const errors = err.logs.filter(x => x.type === 'error')
            const debugs = err.logs.filter(x => x.type === 'debug')

            t.equal(errors[0].message, '[400] Bad Request', '[400] Bad Request')
            t.equal(debugs[0].message, 'TokenExpiredError: jwt expired', 'TokenExpiredError: jwt expired')
        })
})

test('actions.validateToken with non-access_token fails', t => {
    t.plan(2)

    const state = {
        props: {
            refresh_token: foreverIdToken
        },
        actions: {
            readFile: () => Promise.resolve(publicKey)
        },
        logs: []
    }

    validateToken(state)
        .catch(err => {
            const errors = err.logs.filter(x => x.type === 'error')
            const debugs = err.logs.filter(x => x.type === 'debug')

            t.equal(errors[0].message, '[400] Bad Request', '[400] Bad Request')
            t.equal(debugs[0].message, 'JsonWebTokenError: typ is invalid. expected Refresh.', 'JsonWebTokenError: typ is invalid. expected Refresh.')
        })
})

test('actions.validateToken with valid access_token sets user', t => {
    t.plan(1)

    const state = {
        props: {
            refresh_token: foreverRefreshToken
        },
        actions: {
            readFile: () => Promise.resolve(publicKey)
        },
        logs: []
    }

    validateToken(state)
        .then(state => t.ok(state.user, 'user was expected'))
})

