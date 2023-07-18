import { createConfig, configureChains } from "wagmi"
import { publicProvider } from "wagmi/providers/public";
import { mainnet } from 'wagmi';

const { chains: _chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()],
)

export const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
})