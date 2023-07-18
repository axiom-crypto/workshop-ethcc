import { axiom } from '@/shared/axiom';
import GenerateProofButton from './GenerateProofButton';
import ClaimTokens from '../claimTokens/ClaimTokens';

interface GenerateProofProps {
  address: string;
  blockNumber: number;
}

export default async function GenerateProof(props: GenerateProofProps) {
  const { address, blockNumber } = props;

  const qb = await axiom.newQueryBuilder();
  await qb.append({
    blockNumber: blockNumber,
    address: address,
  });
  const { keccakQueryResponse, query } = await qb.build();

  return (
    <>
      <GenerateProofButton 
        keccakQueryResponse={keccakQueryResponse} 
        query={query}
        axiomV1QueryAddress={axiom.getAxiomQueryAddress() as string}
        axiomV1QueryAbi={axiom.getAxiomQueryAbi()}
      >
        <ClaimTokens address={address} keccakQueryResponse={keccakQueryResponse} />
      </GenerateProofButton>
    </>
  )
}