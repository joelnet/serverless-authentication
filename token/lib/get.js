module.exports = function get(props, obj) {
    const head = props[0]
    const tail = props.slice(1)

    return props.length < 1 || obj == null
        ? obj
        : get(tail, obj[head])
}
