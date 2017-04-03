const test = require('tape')
const withLibs = require('../../lib/withLibs')

const libs = {
    fs: 'fs-lib',
    Promise: 'fs-Promise'
}

test('lib/withLibs with null libs does not set libs property on object', t => {
    const func = withLibs(null, props => {
        t.notOk(props.libs, 'props.libs should not exist on object')
        t.end()
    })

    func({})
})

test('lib/withLibs with {} libs does not set libs property on object', t => {
    const func = withLibs(null, props => {
        t.notOk(props.libs, 'props.libs should not exist on object')
        t.end()
    })

    func({})
})

test('lib/withLibs with null props sets libs property on object', t => {
    const func = withLibs(libs, props => {
        t.ok(props.libs, 'libs should not exist on object')
        t.end()
    })

    func(null)
})

test('lib/withLibs with null libs and null props sets props as null', t => {
    const func = withLibs(null, props => {
        t.equal(props, null, 'props should be null')
        t.end()
    })

    func(null)
})

test('lib/withLibs with null libs and null props sets props as null', t => {
    const func = withLibs(null, props => {
        t.equal(props, null, 'props should be null')
        t.end()
    })

    func(null)
})

test('lib/withLibs with {} libs and null props sets props as null', t => {
    const func = withLibs({}, props => {
        t.equal(props, null, 'props should be null')
        t.end()
    })

    func(null)
})

test('lib/withLibs sets libs', t => {
    const func = withLibs(libs, props => {
        t.equal(props.libs.fs, libs.fs, 'props.libs.fs should equal libs.fs')
        t.equal(props.libs.Promise, libs.Promise, 'props.libs.Promise should equal libs.Promise')
        t.end()
    })

    func(null)
})

test('lib/withLibs does not overwrite props.libs', t => {
    const func = withLibs(libs, props => {
        t.equal(props.libs.fs, 'original', 'props.libs.fs should equal original')
        t.end()
    })

    func({
        libs: {
            fs: 'original'
        }
    })
})
