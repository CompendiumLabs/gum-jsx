// The Riemann zeta function: the deck's prelude (see index.json). The
// numerics every slide draws from: zeta on the right half plane by Borwein's
// algorithm, its values on the critical line, and the first nontrivial zeros.

// Borwein's algorithm coefficients for the Dirichlet eta function
const NB = 64
const terms = range(1, NB+1).reduce(
  (acc, i) => [...acc, acc[acc.length-1] * 4*(NB+i-1)*(NB-i+1) / (2*i*(2*i-1))], [1/NB]
)
const dk = cumsum(terms, false).map(d => NB*d)
const dn = dk[NB]
const wk = range(0, NB).map(k => pow(-1, k) * (dk[k] - dn) / dn)

// complex zeta(sigma + i t) for sigma > 0, returned as [re, im]
const zeta = (sigma, t) => {
  const ks = range(0, NB)
  const ere = -sum(ks.map(k => wk[k] * pow(k+1, -sigma) * cos(t * log(k+1))))
  const eim =  sum(ks.map(k => wk[k] * pow(k+1, -sigma) * sin(t * log(k+1))))
  const p = pow(2, 1-sigma), a = t * log(2)
  const dre = 1 - p * cos(a), dim = p * sin(a)
  const den = dre*dre + dim*dim
  return [(ere*dre + eim*dim) / den, (eim*dre - ere*dim) / den]
}
const zreal = s => zeta(s, 0)[0]
const zabs = t => { const [a, b] = zeta(0.5, t); return sqrt(a*a + b*b) }
const zre = t => zeta(0.5, t)[0]
const zim = t => zeta(0.5, t)[1]

// imaginary parts of the first ten nontrivial zeros, and how far up the line the slides go
const zeros = [14.1347, 21.0220, 25.0109, 30.4249, 32.9351, 37.5862, 40.9187, 43.3271, 48.0052, 49.7738]
const tmax = 50
