import { JsonRpcProvider } from "ethers";
import { numberToHex } from "./utils";

export const getProof = async (provider: JsonRpcProvider, address: string, blockNumber: number): Promise<any> => {
  const proof = await provider.send("eth_getProof", [address, [], numberToHex(blockNumber)]);
  return proof;
}

export const getFirstTxBlockNumber = async (address: string): Promise<number> => {
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