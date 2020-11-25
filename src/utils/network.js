
const blockExplorers = {
  1: 'https://etherscan.io',
  122: 'https://explorer.fuse.io'
}

export const getBlockExplorerUrl = (networkId) => blockExplorers[networkId]
