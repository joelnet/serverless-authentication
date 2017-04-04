const I = a => a
const K = a => b => a
const KI = K(I)

module.exports = {
    before: (before, fn) => x => KI(before(x))(fn(x)),
    leftApply: (fn, a) => (b) => fn(a, b),
    rightApply: (fn, a) => (b) => fn(b, a)
}
