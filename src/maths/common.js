function gcd(a, b) {
    return !b ? a : gcd(b, a % b);
}

function factors(number) {
    return Array.from(Array(number + 1), (_, i) => i).filter(i => number % i === 0);
}