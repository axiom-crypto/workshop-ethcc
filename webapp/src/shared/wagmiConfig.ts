import { createConfig, configureChains } from "wagmi"
import { publicProvider } from "wagmi/providers/public";
import { goerli } from "viem/dist/types/chains";

const { chains: _chains, publicClient, webSocketPublicClient } = configureChains(
  [goerli],
  [publicProvider()],
)

export const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
})