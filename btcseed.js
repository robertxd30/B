const bip39 = require('bip39');
const ecc = require('tiny-secp256k1');
const { BIP32Factory } = require('bip32');
const bitcoin = require('bitcoinjs-lib');
const readline = require('readline');
const fs = require('fs');
const axios = require('axios');

const filePath = './btcseed.txt';
const outputfilePath = './btcseedoutput.txt';

const fileStream = fs.createReadStream(filePath);

const delaytime = 15000 // must bigger than 10000

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Create an interface to read the file line by line
const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity // Recognize all instances of CR LF as a single line break
});

async function run() {
    for await (const line of rl) {
        try {
            // await wait(delaytime);
            const bip32 = BIP32Factory(ecc);

            const seedBuffer = bip39.mnemonicToSeedSync(line);
            const root = bip32.fromSeed(seedBuffer);
            const account = root.derivePath("m/84'/0'/0'");
            const node = account.derivePath("0");
            const child = node.derive(0);
            const publicKey = child.publicKey;
            console.log(child.privateKey.toString('hex'))

            const { address } = bitcoin.payments.p2wpkh({ pubkey: publicKey });

            console.log("Address: " + address);

            const url = 'https://blockchain.info/q/addressbalance/' + address;
            let response = await axios.get(url)

            fs.appendFileSync(outputfilePath,line + "  " + response.data.toString() + "\n");

            console.log(response.data)
        } catch (err) {
            console.error('Error writing to file:', err);
        }

    };
}

run()
