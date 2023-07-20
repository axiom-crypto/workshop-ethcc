"use client";

import { Config } from "@/shared/config";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import DistributorAbi from '@/shared/abi/Distributor.json';
import Button from "../ui/Button";

interface ClaimTokensButtonProps {
  responseData: any;
}

export default function ClaimTokensButton(props: ClaimTokensButtonProps) {
  const { responseData } = props;

  // Prepare the claim transaction
  const { config } = usePrepareContractWrite({
    address: Config.DISTRIBUTOR_CONTRACT_ADDR as `0x${string}`,
    abi: DistributorAbi.abi,
    functionName: 'claim',
    args: [responseData],
  })
  const { data, write } = useContractWrite(config);
  
  // Listen for transaction completion
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  if (isLoading) {
    return (
      <div>
        Claiming Distributor NFT...
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center">
        <div className="text-2xl text-highlight font-bold">
          Distributor NFT claimed!
        </div>
        <div>
          Tx hash: { data?.hash }
        </div>
      </div>
    )
  }

  return (
    <Button
      disabled={!write}
      onClick={() => {
        write?.()
      }}
    >
      { write ? "Claim Distributor NFT" : "Distributor NFT already claimed" }
    </Button>
  )
}