import { axiom } from '@/shared/axiom';
import GenerateProofClient from './GenerateProofClient';
import ClaimTokensServer from '../claimTokens/ClaimTokensServer';

interface GenerateProofProps {
  blockNumber: number;
  address: string;
}

export default async function GenerateProof(props: GenerateProofProps) {
  const { blockNumber, address } = props;

  /**
   * TODO: Use your Axiom instance to build a Query
   */

  return (
    <GenerateProofClient 
      keccakQueryResponse={keccakQueryResponse} 
      query={query}
      blockNumber={blockNumber}
      axiomV1QueryAddress={axiom.getAxiomQueryAddress() as string}
      axiomV1QueryAbi={axiom.getAxiomQueryAbi()}
    >
      <ClaimTokensServer 
        blockNumber={blockNumber} 
        address={address} 
        keccakQueryResponse={keccakQueryResponse}
      />
    </GenerateProofClient>
  )
}