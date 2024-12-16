const { TronWeb } = require('tronweb');
const readline = require('readline');
const fs = require('fs');
const axios = require('axios');

const filePath = './tronpvkey.txt';
const outputfilePath = './tronpvkeyoutput.txt';

const fileStream = fs.createReadStream(filePath);

const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity // Recognize all instances of CR LF as a single line break
});

const tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io',
    headers: { 'TRON-PRO-API-KEY': 'd5f7660e-74c0-4d0a-b000-1738aec4a6c9' },
  });

// balance = await tronWeb.trx.getBalance(TronWeb.fromMnemonic("announce room limb pattern dry unit scale effort smooth jazz weasel alcohol", "m/44'/195'/0'/0/0"));
// console.log(balance)


async function run() {
    for await (const line of rl) {
        try {
            const address = tronWeb.address.fromPrivateKey(line);
            fs.appendFileSync(outputfilePath,line + "  " + address + "\n");

        } catch (err) {
            console.error('Error writing to file:', err);
        }

    };
}

run()
