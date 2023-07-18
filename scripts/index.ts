import { 
  Axiom,
  AxiomConfig,
  SolidityAccountResponse,
  SolidityBlockResponse,
  SolidityStorageResponse,
  ValidationWitnessResponse,
} from '@axiom-crypto/core';
import type { QueryBuilder } from '@axiom-crypto/core/query/queryBuilder';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

import { abi as distributorAbi } from "../contracts/out/Distributor.sol/Distributor.json";

// Update w/ your deployment address
const distributorAddress = "0x92ed3582b834ecf02841e799499f6a7761b5af24"; 

// Optional: update with your keccakQueryResponse if you are making manual subsequent calls with an
// already-proven set of Query data (that would have the same keccakQueryResponse)
const keccakQueryResponse = "0xb3f7efd7946900b34c81d2b1b6cd669b33344922c74676434d3aa69079e82d1b"; 

const providerUri = process.env.ALCHEMY_PROVIDER_URI_GOERLI ?? 'http://localhost:8545';
const provider = new ethers.JsonRpcProvider(providerUri);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
const walletAddress = wallet.address;

if (!process.env.PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY environment variable is not set");
}

const config: AxiomConfig = {
  providerUri,
  version: "v1",
  chainId: 5,
  mock: true,
};
const ax = new Axiom(config);

async function buildQuery() {
  // Get account age data from Provider
  const blockNumber = await getFirstTxBlockNumber(walletAddress);

  if (isNaN(blockNumber)) {
    throw new Error("blockNumber is NaN");
  }

  const qb = ax.newQueryBuilder();
  await qb.append({
    blockNumber: blockNumber,
    address: walletAddress,
  });
  return qb;
}

async function submitQuery(qb: QueryBuilder) {
  const { keccakQueryResponse, queryHash, query } = await qb.build();
  console.log("keccakQueryResponse", keccakQueryResponse);
  console.log("queryHash", queryHash);
  console.log("query", query);
  
  const axiomV1Query = new ethers.Contract(
    ax.getAxiomQueryAddress() as string,
    ax.getAxiomQueryAbi(),
    wallet
  );

  const txResult = await axiomV1Query.sendQuery(
    keccakQueryResponse,
    walletAddress,
    query,
    {
      value: ethers.parseEther("0.01"), // Goerli payment amount
    }
  );
  const txReceipt = await txResult.wait(); 
  console.log("sendQuery Receipt", txReceipt);

  console.log("Waiting for proof to be generated. This may take a few minutes...")

  axiomV1Query.on("QueryFulfilled", async (keccakQueryResponse, _payment, _prover) => {
    console.log("Proof generated! Calling claimTokensTransaction...")
    claimTokensTransaction(keccakQueryResponse);
  });
}

async function claimTokensTransaction(keccakQueryResponse: string) {
  const responseTree = await ax.query.getResponseTreeForKeccakQueryResponse(keccakQueryResponse);
  if (!responseTree) {
    throw new Error("Response tree is undefined");
  }
  const blockNumber = await getFirstTxBlockNumber(walletAddress);

  const keccakBlockResponse = responseTree.blockTree.getHexRoot();
  const keccakAccountResponse = responseTree.accountTree.getHexRoot();
  const keccakStorageResponse = responseTree.storageTree.getHexRoot();

  const responses = {
    keccakBlockResponse,
    keccakAccountResponse,
    keccakStorageResponse,
    blockResponses: [] as SolidityBlockResponse[],
    accountResponses: [] as SolidityAccountResponse[],
    storageResponses: [] as SolidityStorageResponse[],
  };
  const witness: ValidationWitnessResponse = ax.query.getValidationWitness(
    responseTree,
    blockNumber,
    walletAddress
  ) as ValidationWitnessResponse;
  if (witness.accountResponse) {
    responses.accountResponses.push(witness.accountResponse);
  }

  console.log(responses);
  
  const distributor = new ethers.Contract(
    distributorAddress,
    distributorAbi,
    wallet
  );
  const txResult = await distributor.claimTokens(responses);
  console.log("setNumber tx", txResult);
  const txReceipt = await txResult.wait();
  console.log("setNumber Receipt", txReceipt);

  console.log("Congrats! Now you have DST tokens!");
}

async function getFirstTxBlockNumber(address: string) {
  const res = await fetch(process.env.ALCHEMY_PROVIDER_URI_GOERLI as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "jsonrpc": "2.0",
      "id": 0,
      "method": "alchemy_getAssetTransfers",
      "params": [
        {
          "fromAddress": address,
          "maxCount": "0x1",
          "excludeZeroValue": true,
          "category": [
            "external"
          ]
        }
      ]
    })
  });
  const data = await res.json();
  const blockNum = data?.result?.transfers[0]?.blockNum;
  return parseInt(blockNum, 16);
}

async function buildAndSubmit() {
  const qb = await buildQuery();
  await submitQuery(qb);
}

// Step 1: First, call this function. Once the `keccakQueryResponse` has been submitted to the
// AxiomV1Query function, subsequent calls will revert since the `keccakQueryResponse` is saved 
// to contract storage already.
buildAndSubmit();

// After the Query has been fulfilled, you may want to try calling your contract function again. 
// You can either change the data you pass into QueryBuilder, or if you want to use the same Query,
// you can do so by uncommenting the following line (be sure to comment the above buildAndSubmit() 
// function call since the same Query has already been submitted):
// claimTokensTransaction(keccakQueryResponse)