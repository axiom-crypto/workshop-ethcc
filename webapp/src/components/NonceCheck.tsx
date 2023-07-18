import { JsonRpcProvider } from "ethers";
import { getFirstTxBlockNumber } from "@/shared/provider";
import { Config } from "@/shared/config";
import GenerateProof from "./generateProof/GenerateProof";

interface NonceProps {
  address: string | undefined;
}

export default async function NonceCheck(props: NonceProps) {
  const { address } = props;

  if (!address) {
    return null;
  }

  const providerUri = process.env.ALCHEMY_PROVIDER_URI_GOERLI as string;
  const provider = new JsonRpcProvider(providerUri);
  const blockNumber = await getFirstTxBlockNumber(address);
  
  if (isNaN(blockNumber)) {
    return null;
  }

  const canClaim = () => {
    return (
      <div className="flex flex-col my-8 gap-2 items-center">
        <div className="text-2xl font-bold">
          Congratulations!
        </div>
        <div>
          Your account is old enough to claim Distributor tokens.
        </div>
        <div>
          <GenerateProof address={address} blockNumber={blockNumber} />
        </div>
      </div>
    )
  }

  const cannotClaim = () => {
    return (
      <div>
        Unfortunately, your account is not old enough to mint Distributor tokens.
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-0">
      <div>
        First transaction: {blockNumber}
      </div>
      { blockNumber - Config.AGE_THRESHOLD ? canClaim() : cannotClaim() }
    </div>
  )
}