module.exports = state =>
    (state.logs.map(console.log.bind(console)), state)
