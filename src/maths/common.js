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

    primality(n) {
        for (let i = 2; i < n; i++) {
            if (n % i == 0) { return false; }
        }
        return true;
    }

    // totient(n) {
    //     if (n == 1) { return 1; }
    //     else if (n == 2) { return 1; }
    //     else if (this.primality(n)) { return (n-1); }
    //     else if (!this.primality(n)) {
    //         let factor = this.smallestFactor(n);
    //         return this.totient(n / factor) * this.totient(factor);
    //     }
    // }

    totient(n) {
        let count = 0;
        for (let i = 1; i < n; i++) {
            if (this.gcd(n,i) == 1) {
                count++;
            }
        }
        return count;
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
        return [...new Set(factors)];
    }

    factorDegree(n, p, counter) {
        let leftover = n % p;
        counter++;
        if (leftover != 0 && leftover % p == 0) { this.factorDegree(leftover, p, counter); }
        else { 
            console.log(p, counter);
            return [counter, leftover];
         }
    }

    findDegree(n, p) {
        //find the degree of p in n
        let degree = 0;
        let leftover = n;
        while (leftover % p == 0) {
            degree++;
            leftover /= p;
        }
        return degree;
    }

    // allDegrees(n) {
    //     return this.primeFactors(n).map(elem => {
    //         return [elem, this.findDegree(n, elem)];
    //     });
    // }

    // shadesteps(n) {
    //     let pfactors = this.allDegrees(n);
    //     let steps = pfactors.map(elem => {
    //         return Math.floor(255 / elem[1]);
    //     });
    //     return steps;
    // }

    orderColour(n, i) {
        // console.log(i);
        if (i == 0) { return '0xdedede'; }
        let shades = '';
        let gcd = this.gcd(n, i);
        let pfactors = this.primeFactors(n);
        // console.log(pfactors);
        if (gcd == 1) { shades = '0x3a3a3a'; }
        else { 
            // console.log(i);
            let ndegrees = pfactors.map(elem => {
                return this.findDegree(n, elem);
            });
            let idegrees = pfactors.map((elem, index) => {
                return (this.findDegree(i, elem) < ndegrees[index] ? this.findDegree(i, elem) : ndegrees[index]);
            });
            // console.log(idegrees, ndegrees);
            // console.log(degrees);
            let components = idegrees.map((elem, index) => {
                if (elem == 0) { return '00'; }
                let temp = Math.floor( (elem / ndegrees[index]) * 255).toString(16);
                if (temp.length == 1) { temp = '0' + temp; }
                return temp;
                // return Math.floor(255 / (elem == 0 ? 255 : elem)).toString(16);
            });
            if (!components[1]) { components[1] = '00'; }
            if (!components[2]) { components[2] = '00'; }
            shades = '0x' + components[0] + components[2] + components[1];    
        }
        // console.log(i, shades);
        return shades;

    }

    multiplicativeOrders(n, i) {
        if (i == 0) { return '0xdedede'; }
        let shades = '';
        let gcd = this.gcd(n, i);
        let pfactors = this.primeFactors(n);
        // console.log(pfactors);
        if (gcd == 1) { shades = '0x2f2f2f'; }
        else { 
            // console.log(i);
            let ndegrees = pfactors.map(elem => {
                return this.mDegree(n, elem);
            });
            let idegrees = pfactors.map((elem, index) => {
                return (this.mDegree(i, elem) < ndegrees[index] ? this.mDegree(i, elem) : ndegrees[index]);
            });
            // console.log(idegrees, ndegrees);
            // console.log(degrees);
            let components = idegrees.map((elem, index) => {
                if (elem == 0) { return '00'; }
                let temp = Math.floor( (elem / ndegrees[index]) * 255).toString(16);
                if (temp.length == 1) { temp = '0' + temp; }
                return temp;
                // return Math.floor(255 / (elem == 0 ? 255 : elem)).toString(16);
            });
            if (!components[1]) { components[1] = '00'; }
            if (!components[2]) { components[2] = '00'; }
            shades = '0x' + components[0] + components[2] + components[1];    
        }
        // console.log(i, shades);
        return shades;
 
    }

    mDegree(n, p) {
        //find the degree of p in n
        let degree = 0;
        let leftover = n;
        while ((leftover / p) == 0) {
            degree++;
            leftover = (leftover / p);
        }
        return degree;
    }

    mOrder(n, i) {
        let order = 1;
        let temp = i;
        while (temp != 1) {
            order++;
            temp = (temp * i) % n;
        }
        return order;
    }

    findEquivOrder(n, i) {
        let phi = this.totient(n);
        let order = this.mOrder(n, i);
        for (let k = 0; k < phi; k++) {
            let temp = n / this.gcd(phi, k);
            if (temp == order) { console.log("found equivalent"); } // { return this.orderColour(phi, k); }
        }
        console.log("no equivalent");
        return '0xfefefe';
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