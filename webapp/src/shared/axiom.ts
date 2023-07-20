import { Axiom, AxiomConfig } from "@axiom-crypto/core";

const config: AxiomConfig = {
  providerUri: process.env.ALCHEMY_PROVIDER_URI_GOERLI as string,
  version: "v1",
  chainId: 5,
  mock: true,
};
export const axiom = new Axiom(config);

export const AXIOM_V1_QUERY_ADDRESS = axiom.getAxiomQueryAddress();
export const AXIOM_V1_QUERY_ABI = axiom.getAxiomQueryAbi();