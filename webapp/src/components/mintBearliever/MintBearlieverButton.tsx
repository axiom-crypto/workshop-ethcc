"use client";

import { Config } from "@/shared/config";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import DistributorAbi from '@/shared/abi/Distributor.json';

interface MintDistributorButtonProps {
  responses: any;
}

export default function MintDistributorButton(props: MintDistributorButtonProps) {
  const { responses } = props;
  const { address } = useAccount();

  // Prepare the sendQuery transaction 
  const { config } = usePrepareContractWrite({
    address: Config.Distributor_ADDR as `0x${string}`,
    abi: DistributorAbi.abi,
    functionName: 'mint',
    args: [responses],
  })
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center">
        <div className="text-2xl font-bold">
          Distributor NFT Minted!
        </div>
        <div>
          Tx hash: { data?.hash }
        </div>
      </div>
    )
  }

  return (
    <button 
      disabled={!write} 
      onClick={() => {
        console.log("Mint Distributor");
        write?.();
      }}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 duration-100 cursor-pointer"
    >
      Mint Distributor NFT
    </button>
  )
}