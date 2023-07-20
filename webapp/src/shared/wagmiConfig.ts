import { createConfig, configureChains } from "wagmi"
import { publicProvider } from "wagmi/providers/public";
import { goerli } from "@wagmi/core/chains";

const { chains: _chains, publicClient, webSocketPublicClient } = configureChains(
  [goerli],
  [publicProvider()],
)

export const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
})