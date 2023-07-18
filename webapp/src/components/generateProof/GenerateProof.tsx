import { axiom } from '@/shared/axiom';
import GenerateProofButton from './GenerateProofButton';
import MintDistributor from '../mintDistributor/MintDistributor';

interface GenerateProofProps {
  address: string;
  blockNumbers: number[];
}

export default async function GenerateProof(props: GenerateProofProps) {
  const { address, blockNumbers } = props;

  const qb = await axiom.newQueryBuilder();
  await qb.append({
    blockNumber: blockNumbers[0],
    address: address,
  });
  await qb.append({
    blockNumber: blockNumbers[1],
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
        <MintDistributor address={address} keccakQueryResponse={keccakQueryResponse} />
      </GenerateProofButton>
    </>
  )
}