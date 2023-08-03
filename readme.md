# Axiom Workshop (EthCC 2023)

⚠️ This repository was used for an Axiom workshop at EthCC 2023. The `main` branch is incomplete and requires the developer to fill in some modules. To see the full working solution to this repository, go to the [examples](https://github.com/axiom-crypto/examples/tree/main/age-gate-mint) repository.

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

## /webapp

Simple web app in Next.js 13 (app router) that emulates all of the functionality as above but in a user-facing dApp.

Required .env.local file:
```
ALCHEMY_PROVIDER_URI_GOERLI=
```

Run dev server
```
pnpm dev
```
