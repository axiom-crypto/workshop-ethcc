import { getFirstTxBlockNumber, getProof } from "@/shared/provider";
import { Config } from "@/shared/config";
import GenerateProof from "./generateProof/GenerateProof";

interface NonceProps {
  address: string | undefined;
}

export default async function NonceCheck(props: NonceProps) {
  const { address } = props;
  console.log("Addr", address);
  if (!address) {
    return null;
  }

  // Get the block number of the first transaction for this address
  const blockNumber = await getFirstTxBlockNumber(address);
  console.log("bn", blockNumber);
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
        Last transaction: {blockNumber}
      </div>
      { blockNumber - Config.AGE_THRESHOLD ? canClaim() : cannotClaim() }
    </div>
  )
}