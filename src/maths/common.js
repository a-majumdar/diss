function gcd(a, b) {
    return !b ? a : gcd(b, a % b);
}