const ecc = require('tiny-secp256k1');
const { BIP32Factory } = require('bip32');
const bitcoin = require('bitcoinjs-lib');
const readline = require('readline');
const fs = require('fs');
const axios = require('axios');
const filePath = './btcprivkeys.txt'; // Change this to your private key file
const outputfilePath = './btcprivkeysoutput.txt';
const fileStream = fs.createReadStream(filePath);

const delaytime = 15000; // must be bigger than 10000
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Create an interface to read the file line by line
const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity // Recognize all instances of CR LF as a single line break
});

async function run() {
    for await (const line of rl) {
        try {
            await wait(delaytime);
            // Decode WIF private key
            const keyPair = bitcoin.ECPair.fromWIF(line.trim());
            const { address } = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey });
            console.log("Address: " + address);
            const url = 'https://blockchain.info/q/addressbalance/' + address;
            let response = await axios.get(url);
            fs.appendFileSync(outputfilePath, line + "  " + response.data.toString() + "\n");
            console.log(response.data);
        } catch (err) {
            console.error('Error:', err);
        }
    }
}

run();