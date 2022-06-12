
# A multi-chain wallet

## Public-private key cryptography
Any interaction currently in the Ethereum ecosystem is done between addresses,: contract adresses or *externally owned addresses* (EOA). Ownership off assets for the EOAs is proven with a *digital private key*. The private key is used for signing transactions and sending them on-chain. The public key - and the user address - are, in turn, derived from the private key using  one or the other hashing algorithm. *Elliptic curve cryptography* is used in Ethereum's use of private keys and digital signatures. 

### EVM wallets 
##### Private key generation
In order to generate a private key keccak-256 hashing algorithm is applied to a randomly generated string of data (generally more than 256 bits in length). The output of the keccak-256 hash must be in a specified range - less than a certain number. In case it is not, simply a new string is generated and keccak-256 is applied.
##### Public key generation
The public key is generated from this private key using [elliptic curve multiplication](https://andrea.corbellini.name/2015/05/17/elliptic-curve-cryptography-a-gentle-introduction/) which is practically irreversible. K = k*G, where k is the private key, G is a constant point called *generator point*. G is a point in the (x,y) axis and as per the secp256k1 standard is equal to (0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798, 0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8). The secp256k1 standard is conventionally used by EVM chains. Once value of K is calculated, which is also a point in the (x,y) axis, the public key can eb calculated which is simply a concatenation of :
```
"04" + x-coordinate of K(32 bytes) + y-coordinate of K(32 bytes)
```
The public key is 132 hex characters in length (or 66 bytes).
##### Address generation
Once the public key is generated, the address is calculate. First, the keccak-256 hash of the concatenation of x- and y- coordinate of K (note that the "04" part of the public key is simply omitted) is calculated, and we keep only the last 20 bytes (40 hex characters) of keccak-256's output.

##### Extra measure: checksum


### Non-EVM wallets
For the case of Non-EVM wallets, the implementations followed for generation of private-public key pairs may be different and characteristic to each network. Due to lack of consensus between Non-EVM chains, the implementations followed for each network is needed to be studied independently. 

#### Solana

Let us further see how the private keys are generated for the Solana network using CLI. 

1.  Install the Solana release  [v1.10.24] on your machine by running:
```
sh -c "$(curl -sSfL https://release.solana.com/v1.10.24/install)"
```
-   Depending on your system, the end of the installer messaging may prompt you to
```
Please update your PATH environment variable to include the solana programs:
```
-   If you get the above message, copy and paste the recommended command below it to update  `PATH`
-   Confirm you have the desired version of  `solana`  installed by running:
```
solana --version
```
2. Generating a new keypair can be done using the `solana-keygen new` command. The command will generate a random seed phrase, ask you to enter an optional passphrase, and then will display the derived public key and the generated seed phrase for your paper wallet.

```
solana-keygen new --no-outfile
```

3. Public keys can be derived from a seed phrase and a passphrase if you choose to use one. This is useful for using an offline-generated seed phrase to derive a valid public key. The  `solana-keygen pubkey`  command will walk you through how to use your seed phrase (and a passphrase if you chose to use one) as a signer with the solana command-line tools using the  `prompt`  URI scheme.
```
solana-keygen pubkey prompt://
```
4. If needed, you can access the legacy, raw keypair's pubkey by instead passing the  `ASK`  keyword:
```
solana-keygen pubkey ASK
```
## Method used 

### Generating private keys
The problem statement for the repository is that many gamers play games on different chains. Strong the seed phrases for each of the wallets that [MetaMask](https://metamask.io), [Phantom](https://phantom.app) or [Atomic Wallet](https://atomicwallet.io) wallet generates. We will now try to solve this problem by generating only a single seed phrase for the gamer to store. The tension for the gamers can be further simplified by a creation a semi-custodian wallet.

We will start with managing keys for our users on Solana and EVM chains (like Polygon) for beginning. Each user's wallet on these chains will have a private key associated with it. Solana and Ethereum are not perfectly compatible since they use different cryptographic curves. Solana uses the ed25519 curve for its accounts / keypairs, whereas Ethereum uses the secp256k1 curve (as discussed earlier).

As a result the private key for a solana wallet is 64 bytes long, and 32 bytes long for an EVM-based wallet. First is we generate a 64-byte long wallet for Solana and extract a 32 byte long key for EVM by hashing the Solana private key 2<sup>16</sup> times with keccak-256 algorithm. As a result we now own two private keys for a single user. The two private keys are saved locally/pushed to our servers. The user, on the other hand will now be able to log into his wallet (the frontend for that is in the current repo) by using his email-id and password. In case the gamer wishes to transfer the private keys to himself, he can extract it from the frontend app and use the conventional wallets separately for each chain.

For generating the solana private key, the follwoign code is used
```
solana-keygen new --outfile {outfile_address}
```

Once the key is generate it is hashed and converted to 32 bytes string using [keccak256](https://www.npmjs.com/package/keccak256) library.

Note that for safety purposes, the mnemonic generated is not stored anywhere since storing a single hex string mitigates the process and ensures higher security of the wallets.


### Generating public keys
The addresses for the wllaets can now be easily generated using npm libraries: `@ethereum-private-key-to-address` and `@solana/web3.js`. 

## Storing the result

The result is stored in a JSON file in accounts folder, and will be displayed on the frontend side as well.
