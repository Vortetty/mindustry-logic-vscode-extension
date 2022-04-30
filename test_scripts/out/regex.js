"use strict";
let str = `set _i_main 0`;
let regex = /(\w+|\s+|".*"|'.*')/g;
console.log(str.split(regex).filter(x => x !== ''));
//# sourceMappingURL=regex.js.map