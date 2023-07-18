"use client";

import { useAccount, useContractEvent, useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import { parseEther } from "viem";
import { use, useEffect, useState } from "react";

interface GenerateProofButtonProps {
  keccakQueryResponse: string;
  query: string;
  axiomV1QueryAddress: string;
  axiomV1QueryAbi: any;
  children: React.ReactNode;
}

export default function GenerateProofButton(props: GenerateProofButtonProps) {
  const { keccakQueryResponse, query, axiomV1QueryAddress, axiomV1QueryAbi, children } = props;
  const { address } = useAccount();
  const [ proofGenerated, setProofGenerated ] = useState(false);

  // Prepare the sendQuery transaction 
  const { config } = usePrepareContractWrite({
    address: axiomV1QueryAddress as `0x${string}`,
    abi: axiomV1QueryAbi,
    functionName: 'sendQuery',
    args: [keccakQueryResponse, address, query],
    value: parseEther("0.01"),
  })
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  // Check that the AxiomV1Query `queries` mapping doesn't already contain this `keccakQueryResponse`
  const { data: queryExists, isLoading: queryExistsLoading } = useContractRead({
    address: axiomV1QueryAddress as `0x${string}`,
    abi: axiomV1QueryAbi,
    functionName: 'queries',
    args: [keccakQueryResponse],
  });

  useEffect(() => {
    if (queryExists?.[1] !== 0) {
      setProofGenerated(true);
    }
  }, [queryExists]);
  

  // Add listener for QueryFulfilled event
  useContractEvent({
    address: axiomV1QueryAddress as `0x${string}`,
    abi: axiomV1QueryAbi,
    eventName: 'QueryFulfilled',
    listener(log) {
      console.log(log);
      setProofGenerated(true);
    },
  })

  const renderLoading = () => {
    if (!isLoading) {
      return null;
    }
    return (
      <div>
        Transaction procesing...
      </div>
    )
  }

  const renderSuccess = () => {
    if (!isSuccess) {
      return null;
    }
    return (
      <div className="flex flex-col items-center">
        <div>
          Proof successfully submitted to Axiom. Proof can take 1-3 minutes to generate...
        </div>
      </div>
    )
  }

  const renderProofGenArea = () => {
    if (!proofGenerated) {
      return (
        <>
          { renderLoading() }
          { renderSuccess() }
        </>
      )
    }
    return (
      <div className="flex flex-col items-center my-8 gap-2">
        <div>
          Proof successfully generated.
        </div>
        { children }
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <button 
        disabled={!write} 
        onClick={() => {
          console.log("Write", write);
          write?.()
        }}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 duration-100 cursor-pointer"
      >
        Generate Proof
      </button>
      { renderProofGenArea() }
    </div>
  )
}