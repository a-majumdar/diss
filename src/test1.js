import {TestClass} from './test2.js';

var test2 = new TestClass();
var h1= document.createElement('H1');
h1.innerHTML = test2.message();
console.log(h1.innerHTML);

const container = document.getElementById('testing');
container.append(h1);