const test         = require('tape')
const validateUser = require('../../actions/validateUser')

test('actions.validateUser with no user fails', t => {
    t.plan(2)

    const state = {
        props: {
            password: 'password'
        }
    }

    validateUser(state)
        .catch(err => {
            const errors = err.logs.filter(x => x.type === 'error')

            t.true(errors.length, 'state.logs should contain type error')
            t.true(errors[0].message.indexOf('[401] Unauthorized') > -1, '[401] Unauthorized')
        })
})

test('actions.validateUser with bad password hash fails', t => {
    t.plan(2)

    const state = {
        props: {
            password: 'password'
        },
        user: {
            password: 'bad-password-hash'
        }
    }

    validateUser(state)
        .catch(err => {
            const errors = err.logs.filter(x => x.type === 'error')

            t.true(errors.length, 'state.logs should contain type error')
            t.true(errors[0].message.indexOf('[401] Unauthorized') > -1, '[401] Unauthorized')
        })
})