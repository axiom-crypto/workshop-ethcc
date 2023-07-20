import { getFirstTxBlockNumber, getProof } from "@/shared/provider";
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

  const blockNumber = await getFirstTxBlockNumber(address);
  if (blockNumber === undefined || isNaN(blockNumber)) {
    return null;
  }

  const canClaim = () => {
    return (
      <div className="flex flex-col my-8 gap-2 items-center">
        <div className="text-2xl font-bold">
          Congratulations!
        </div>
        <div>
          Your account is old enough to claim a Distributor NFT.
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
        Unfortunately, your account is not old enough to claim a Distributor NFT.
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-0">
      <div>
        First transaction block: {blockNumber}
      </div>
      { blockNumber - Config.AGE_THRESHOLD ? canClaim() : cannotClaim() }
    </div>
  )
}