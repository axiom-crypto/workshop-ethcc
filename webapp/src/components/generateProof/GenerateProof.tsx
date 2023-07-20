import { axiom } from '@/shared/axiom';
import GenerateProofButton from './GenerateProofButton';
import ClaimTokens from '../claimTokens/ClaimTokens';

interface GenerateProofProps {
  blockNumber: number;
  address: string;
}

export default async function GenerateProof(props: GenerateProofProps) {
  const { blockNumber, address } = props;

  const qb = await axiom.newQueryBuilder();
  await qb.append({
    blockNumber: blockNumber,
    address: address,
  });
  const { keccakQueryResponse, query } = await qb.build();

  return (
    <GenerateProofButton 
      keccakQueryResponse={keccakQueryResponse} 
      query={query}
      axiomV1QueryAddress={axiom.getAxiomQueryAddress() as string}
      axiomV1QueryAbi={axiom.getAxiomQueryAbi()}
    >
      <ClaimTokens blockNumber={blockNumber} address={address} keccakQueryResponse={keccakQueryResponse} />
    </GenerateProofButton>
  )
}