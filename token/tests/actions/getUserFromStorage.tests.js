const test = require('tape')
const getUserFromStorage = require('../../actions/getUserFromStorage')

const getMockState = () =>
    ({
        props: {
            realm: 'realm',
            client_id: 'client_id',
            username: 'username'
        },
        actions: {
            getUser: (realm, username) =>
                Promise.resolve(username == 'username' ? { password: 'encrypted-password' } : null)
        },
        logs: []
    })

test('actions.getUserFromStorage with invalid state fails', t => {
    t.plan(3)

    const state = { logs: [] }

    getUserFromStorage(state)
        .catch(err => {
            const errors = err.logs.filter(x => x.type === 'error')
            const debugs = err.logs.filter(x => x.type === 'debug')

            t.true(errors.length, 'state.logs should contain type error')
            t.true(debugs.length, 'state.logs should contain type debug')
            t.true(errors[0].message.indexOf('[500] Unknown Error') > -1, '[500] Unknown Error')
        })
})

test('actions.getUserFromStorage with no user returns fail', t => {
    t.plan(2)

    const state = getMockState()
    state.props.username = 'unknown-user'

    getUserFromStorage(state)
        .catch(err => {
            const errors = err.logs.filter(x => x.type === 'error')

            t.true(errors.length, 'state.logs should contain type error')
            t.equal(errors[0].message, '[401] Unauthorized')
        })
})

test('actions.getUserFromStorage returns user', t => {
    t.plan(1)

    const user = { username: 'username', password: 'encrypted-password' }
    const state = getMockState()
    state.actions.getUser = () => Promise.resolve(user)

    getUserFromStorage(state)
        .then(state => t.equal(state.user, user, 'state must contain user'))
})