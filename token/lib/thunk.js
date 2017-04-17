module.exports = function thunk(func) {
    const args = Array.prototype.slice.call(arguments, 1)

    return () => func.apply(this, args)
}
