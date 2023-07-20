import { getCurrentBlock } from "@/shared/provider";
import { Config } from "@/shared/config";
import GenerateProofServer from "./generateProof/GenerateProofServer";
import { getFirstTxBlockNumber } from "@/shared/etherscan";

interface NonceProps {
  address: string | undefined;
}

export default async function NonceCheck(props: NonceProps) {
  const { address } = props;
  if (!address) {
    return null;
  }

  // const blockNumber = await getFirstTxBlockNumber(address);
  const blockNumber = await getFirstTxBlockNumber(address);
  if (blockNumber === undefined || isNaN(blockNumber)) {
    return (
      <div className="flex flex-col my-8 gap-2 items-center">
        <div>
          We were not able to find any transactions on your account.
        </div>
      </div>
    );
  }

  const currentBlock = await getCurrentBlock();

  const canClaim = () => {
    return (
      <div className="flex flex-col my-8 gap-2 items-center">
        <div className="text-2xl text-highlight font-bold">
          Congratulations!
        </div>
        <div>
          Your account is old enough to claim a Distributor NFT.
        </div>
        <div>
          <GenerateProofServer address={address} blockNumber={blockNumber} />
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
      { currentBlock - Config.AGE_THRESHOLD > blockNumber ? canClaim() : cannotClaim() }
    </div>
  )
}