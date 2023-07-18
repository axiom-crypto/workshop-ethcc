# Axiom Workshop (EthCC 2023)

The goal of this workshop is to get developers familar with using [Axiom](https://www.axiom.xyz) to generate Zero Knowledge proofs of Ethereum data that they can trustlessly use.

We'll be building a simple ERC20 contract that utilizes 

## /contracts

Contains the Distributor contract. The Distributor contract will send 5000 DST tokens to users who submit a proof of account age greater than 5000 blocks (~1 week).

Required .env file:
```
PROVIDER_URI_GOERLI=
PRIVATE_KEY=
```

You can use the following scripts for starting a local Anvil mainnet fork (run from /contracts folder):

```
./script/local/start_anvil.sh
```

And the following script for deploying to your fork:

```
./script/local/deploy_local.sh
```

## /scripts

Contains a script that sends a historical data Query into the AxiomV1Query contract. Once the Zero Knowledge proof is generated, it calls the Distributor contact to receive tokens.

Required .env file (must use Alchemy since we're using an Alchemy-specific JSON-RPC call):
```
ALCHEMY_PROVIDER_URI_GOERLI=
PRIVATE_KEY=
```

Run via (must be in /scripts directory):

```
pnpm start
```

## /webapp

Simple web app in Next.js 13 (app router) that emulates all of the functionality as above but in a user-facing dApp.
