const networks = {
  56: {
    chainId: '0x38',
    chainName: 'Smart Chain',
    nativeCurrency: {
      name: 'Binance',
      symbol: 'BNB',
      decimals: 18
    },
    rpc: 'https://bsc-dataseed.binance.org',
    explorer: 'https://bscscan.com'
  },
  122: {
    chainId: '0x7a',
    chainName: 'Fuse Network',
    nativeCurrency: {
      name: 'Fuse',
      symbol: 'FUSE',
      decimals: 18
    },
    rpc: 'https://rpc.fuse.io',
    explorer: 'https://explorer.fuse.io'
  }
}

const blockExplorers = {
  1: 'https://etherscan.io',
  56: 'https://bscscan.com',
  122: 'https://explorer.fuse.io'
}

const networkNames = {
  1: 'Mainnet',
  56: 'Binance Smart Chain',
  122: 'Fuse'
}

export const networkIds = {
  MAINNET: 1,
  BSC: 56,
  FUSE: 122
}

export const getBlockExplorerUrl = (networkId) => blockExplorers[networkId]

export const getNetwork = (networkId) => networks[networkId]

export const getNetworkName = (networkId) => networkNames[networkId]
