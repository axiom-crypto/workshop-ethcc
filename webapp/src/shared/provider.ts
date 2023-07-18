import { JsonRpcProvider } from "ethers";
import { numberToHex } from "./utils";

export const getProof = async (provider: JsonRpcProvider, address: string, blockNumber: number): Promise<any> => {
  const proof = await provider.send("eth_getProof", [address, [], numberToHex(blockNumber)]);
  return proof;
}