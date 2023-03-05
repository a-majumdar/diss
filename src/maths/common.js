class Common {

    gcd(a, b) {
        return !b ? a : this.gcd(b, a % b);
    }

    factors(number) {
        let result = [];
        for (let i=0; i<number; i++) { if (number % i == 0) { result.push(i); } }
        return result;
    }

    smallestFactor(n) {
        return this.primeFactors(n)[0];
    }

    primeFactors(n) {
        let factors = [];
        let divisor = 2;
        while (n >= 2) {
            if (n % divisor === 0) {
                factors.push(divisor);
                n /= divisor;
            } 
            else { divisor += divisor > 2 ? 2 : 1; }
        }
        return factors;
    }

    factorDegree(n, p, counter) {
        leftover = n % p;
        counter++;
        if (leftover != 0 && leftover % p == 0) { this.factorDegree(leftover, p, counter); }
        else { return [counter, leftover]; }
    }

    allDegrees(n) {
        return this.primeFactors(n).map(elem => {
            return [elem, this.factorDegree(n, elem, 0)[0]];
        });
    }

    shadesteps(n) {
        let pfactors = this.allDegrees(n);
        let steps = pfactors.map(elem => {
            return 255 / elem[1];
        });
        return steps;
    }

    orderColour(n, i) {
        // let order = n / this.gcd(n, i);
        // let shades = ['00','00','00'];
        // if (pfactors.includes(i)) {
        // for ((factor, index) in this.primeFactors(n)) {
        //     if (i % factor == 0) { shades[index] = 'ff'; }
        // }
        let shades = this.primeFactors(n).map(elem => {
            return i % elem == 0 ? 'ff' : '00';
        })
        return `0x${shades[0]+shades[1]+shades[2]}`;
        // }
    }

    // smallestFactor(n) > 1: prime
    // factorDegree(n, p): repeatedly dividing n by p , return [degree, leftover]
    // wrapper to combine
    // base case: 1
    // e.g. 90 -> ([2,1], 45) -> ([3,2], 5) -> ([5,1], 1) -> return ([2,1], [3,2], [5,1]): input to colour function

    // colour picking: TO REPLACE GREYSCALE
    // for n with < 3 prime factors: ?
    // e.g. n=90, i=15
    // 1. order of 15 in 90 is 6
    // 2. what is the degree of each prime factor of 90 in 6: factorDegree(6,2)(6,3)(6,5) -> [1,1,0] out of possible [1,2,1]
    // 3. take [1/1, 1/2, 0/1] -> R:100% G:50% B:0% -> (255,128,0)


}

export {Common};