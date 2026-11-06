const assert = require('node:assert/strict');
const { moyennePonderee, noteNecessaire } = require('../calculs');

assert.equal(moyennePonderee([{ note: 10, coefficient: 1 }, { note: 16, coefficient: 3 }]), 14.5);
assert.equal(moyennePonderee([]), null);
assert.equal(noteNecessaire([{ note: 10, coefficient: 1 }, { note: 16, coefficient: 3 }], 15, 2), 16);
assert.equal(noteNecessaire([{ note: 19, coefficient: 1 }], 18, 1), 17);
assert.equal(noteNecessaire([{ note: 10, coefficient: 1 }], 20, 1), 30);
console.log('5 vérifications des calculs réussies.');
