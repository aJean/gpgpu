/// <reference path="./gpu.d.ts" />

const gpu = new GPU();
const add = gpu.createKernel(function (a, b) {
    return a + b;
}).setOutput([1]);

console.log(add(1, 2));

