import { arbitrum, mainnet, sepolia , scrollSepolia} from 'wagmi/chains'

const projectId = "f1e14696910030d671edc4604f9b525c";
// 2. Create wagmiConfig
const metadata = {
    name: 'XFI',
    description: 'XFI APP',
    url: 'https://web3modal.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}
import { defineChain } from "viem"
import { defaultWagmiConfig } from '@web3modal/wagmi/react';

const crossfi = defineChain({
    id: 4157,
    name: 'CrossFi Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'XFI',
      symbol: 'XFI',
    },
    rpcUrls: {
      default: {
        http: ['https://rpc.testnet.ms'],
      },
    },
    blockExplorers: {
      default: { name: 'Explorer', url: 'https://scan.testnet.ms' },
    },
  });


const chains = [mainnet, arbitrum, crossfi, sepolia, scrollSepolia]
export const config = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
})