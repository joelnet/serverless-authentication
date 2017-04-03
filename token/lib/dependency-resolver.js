module.exports = defaultDependencies => func => dependencies =>
    func(Object.assign({}, defaultDependencies, dependencies))
