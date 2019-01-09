/// <reference path="./gpu.d.ts" />
var gpu = new GPU();
var add = gpu.createKernel(function (a, b) {
    return a + b;
}).setOutput([1]);
console.log(add(1, 2));
