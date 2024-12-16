const bitcoin = require('bitcoinjs-lib');

// Generate a random key pair
const keyPair = bitcoin.ECPair.makeRandom();
const privateKeyWIF = keyPair.toWIF();

console.log("Generated Private Key (WIF):", privateKeyWIF);