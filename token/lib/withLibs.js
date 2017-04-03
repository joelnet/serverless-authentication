const hasKeys = obj =>
    obj && Object.keys(obj).length

module.exports = (libs, f) => x => {
    if (!hasKeys(libs)) return f(x)

    const _libs = Object.assign({}, libs, (x||{}).libs)
    const _x = Object.assign({}, x, { libs: _libs })
    
    return f(_x)
}
