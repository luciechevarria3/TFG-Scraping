import fs from 'fs';

const str = "‪200,000+‬ usuarios";
const parsed = str.normalize('NFD').replace(/[\u202A\u202C]/g,'');
console.log(str);
console.log(parsed);