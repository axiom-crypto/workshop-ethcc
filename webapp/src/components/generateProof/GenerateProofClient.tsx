"use client";

import { useAccount, useContractEvent, useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import { parseEther } from "viem";
import { useEffect, useState } from "react";
import Button from "../ui/Button";
import Link from "next/link";

interface GenerateProofButtonProps {
  keccakQueryResponse: string;
  query: string;
  blockNumber: number;
  axiomV1QueryAddress: string;
  axiomV1QueryAbi: any;
  children: React.ReactNode;
}

export default function GenerateProofButton(props: GenerateProofButtonProps) {
  const { keccakQueryResponse, query, blockNumber, axiomV1QueryAddress, axiomV1QueryAbi, children } = props;
  const { address } = useAccount();
  const [ proofGenerated, setProofGenerated ] = useState(false);

  // Prepare hook for the sendQuery transaction
  const { config } = usePrepareContractWrite({
    address: axiomV1QueryAddress as `0x${string}`,
    abi: axiomV1QueryAbi,
    functionName: 'sendQuery',
    args: [keccakQueryResponse, address, query],
    value: parseEther("0.01"),
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  // Check that the AxiomV1Query `queries` mapping doesn't already contain this `keccakQueryResponse`
  const { data: queryExists, isLoading: queryExistsLoading } = useContractRead({
    address: axiomV1QueryAddress as `0x${string}`,
    abi: axiomV1QueryAbi,
    functionName: 'queries',
    args: [keccakQueryResponse],
  });

  // If the `keccakQueryResponse` has status 2 (Fulfilled), then the proof has been generated
  useEffect(() => {
    if (queryExists?.[1] === 2) {
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
        Transaction processing...
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
          Proof successfully submitted to Axiom. Proof can take 1-3 minutes to generate...<br />
          See <Link href={`https://explorer.axiom.xyz/goerli/query/${keccakQueryResponse}`} target="_blank">Axiom Explorer (Goerli)</Link> for status.
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
        <div className="font-bold text-highlight text-2xl">
          ZK proof generated
        </div>
        <div className="w-1/2 text-center">
          {`The proof that was generated tells us that your account ${address} had a nonce of 1 at block ${blockNumber}`}
        </div>
        { children }
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <Button
        disabled={!write}
        onClick={() => {
          write?.()
        }}
      >
        { write ? "Generate Proof (0.01 ETH)" : "Proof already generated" }
      </Button>
      { renderProofGenArea() }
    </div>
  )
}