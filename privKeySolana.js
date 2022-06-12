// 86a1057b25419687e2ec41bafd526ed113857a5fdb0bba5efd605a63c2fb4c75

const { execSync } = require('child_process');
const fs = require('fs');
const keccak = require('keccak256');
const privateKeyToAddress = require('ethereum-private-key-to-address');
let solWeb3 = require('@solana/web3.js');

var connectedAccount = "0x123455678";
var timeNow = new Date().getTime().toString();
var timeSlice = timeNow.slice(-4,);
var solPrivKeyLoc = './generated-wallets/wallet-'+timeSlice+ '/my-keypair.json';
console.log({solPrivKeyLoc});

const output1 = execSync('solana-keygen new --outfile ' + solPrivKeyLoc, { encoding: 'utf-8' });

fs.readFile(solPrivKeyLoc, 'utf8', (err, jsonString) => {

    // error handling
    if (err) {
        console.log("File read failed:", err);
        return;
    }

    // reading the generated private key
    solPrivKey = JSON.parse(jsonString);
    strSolana = '';

    // integer to hex
    var intToChar= {0:'0',1:'1', 2:'2', 3:'3', 4:'4', 5:'5', 6:'6', 7:'7', 8:'8', 9:'9',10:'a',11:'b',12:'c',13:'d',14:'e',15:'f'}

    for ( var index = 0; index < solPrivKey.length; index ++ ) {
        var byte = solPrivKey[index] ;
        firstChar = intToChar[Math.floor(byte/16)];
        secondChar = intToChar[byte%16];
        if(firstChar === undefined){
            console.log(byte);
            console.log(byte/16);
            console.log(Math.floor(byte/16));
            throw err;
        }
        strSolana += firstChar;
        strSolana += secondChar;
    }

    // the private key for solana is ready

    var strEVM = strSolana;
    for(var i = 0 ; i < Math.pow(2,16); i++)
    {
        strEVM = strEVM = keccak(strEVM).toString('hex');
    }

    // generate the public addresses for Solana and EVM

    let addrEVM = privateKeyToAddress(strEVM);
    let solPrivKeyF32 = solPrivKey.slice(0,32);
    let firstWinWallet = solWeb3.Keypair.fromSeed(Uint8Array.from(solPrivKeyF32));
    let solAddress =firstWinWallet.publicKey.toString();

    let allData = { 
        account: connectedAccount,
        solPrivKey: strSolana, 
        solAddress: solAddress,
        evmPrivKey: strEVM,
        evmAddress: addrEVM,
        timestamp: timeNow
    };
        

    // Save all data is a JSON file in "accounts" folder
    let data = JSON.stringify(allData);
    fs.writeFileSync('accounts/' + connectedAccount+'.json', data);
    fs.unlinkSync(solPrivKeyLoc);
})

