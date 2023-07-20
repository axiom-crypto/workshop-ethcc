import { axiom } from "@/shared/axiom";
import { SolidityAccountResponse, SolidityBlockResponse, SolidityStorageResponse, ValidationWitnessResponse } from "@axiom-crypto/core";
import ClaimTokensClient from "./ClaimTokensClient";

interface ClaimTokensProps {
  blockNumber: number;
  address: string;
  keccakQueryResponse: string;
}

export default async function ClaimTokens(props: ClaimTokensProps) {
  const { blockNumber, address, keccakQueryResponse } = props;

  const responseTree = await axiom.query.getResponseTreeForKeccakQueryResponse(keccakQueryResponse);
  const keccakBlockResponse = responseTree.blockTree.getHexRoot();
  const keccakAccountResponse = responseTree.accountTree.getHexRoot();
  const keccakStorageResponse = responseTree.storageTree.getHexRoot();

  // Build the responseData object that we'll send to our own NFT contract.
  const responseData = {
    keccakBlockResponse,
    keccakAccountResponse,
    keccakStorageResponse,
    blockResponses: [] as SolidityBlockResponse[],
    accountResponses: [] as SolidityAccountResponse[],
    storageResponses: [] as SolidityStorageResponse[],
  };
  const witness: ValidationWitnessResponse | undefined = axiom.query.getValidationWitness(
    responseTree,
    blockNumber,
    address,
  );
  
  if (!witness) {
    // You'll likely want to fail gracefully here instead of throwing.
    return (
      <div>
        ValidationWitness not found for this query. This can happen if the keccakQueryResponse returns too early. Try refreshing the page.
      </div>
    )
  }
  responseData.accountResponses.push(witness.accountResponse as SolidityAccountResponse);

  return (
    <div>
      <ClaimTokensClient responseData={responseData} />
    </div>
  )
}