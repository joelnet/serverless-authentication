module.exports = function pipeAsync() {
    return arg =>
        Array.prototype.reduce.call(arguments, (promise, next) => promise.then(next), Promise.resolve(arg))
}