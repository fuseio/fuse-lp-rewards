import { SingleRewardProgram, MultiRewardProgram } from '@fuseio/earn-sdk'
import { networkIds } from '@/utils/network'
import { COINGECKO_ID_MAP, REWARDS_PLATFORMS } from '../constants'

const getPairPath = (pairs) => {
  return String(pairs).split(',').join('/')
}

const getPlatformBaseUrl = (platform) => {
  switch (platform) {
    case REWARDS_PLATFORMS.UNISWAP:
      return 'https://app.uniswap.org'
    case REWARDS_PLATFORMS.FUSESWAP:
      return 'https://fuseswap.com'
    case REWARDS_PLATFORMS.PANCAKESWAP:
      return 'https://exchange.pancakeswap.finance'
    case REWARDS_PLATFORMS.FEGEX:
      return 'https://fegex'
  }
}

export const getAddLiquidityLink = (pairs, platform) => {
  return getPlatformBaseUrl(platform) + '/#/add/' + getPairPath(pairs)
}

export const getRewardTokenName = (networkId) => {
  return networkId === networkIds.MAINNET || networkId === networkIds.BSC
    ? 'FUSE'
    : 'WFUSE'
}

export const getPlatformPairName = (platform) => {
  switch (platform) {
    case REWARDS_PLATFORMS.UNISWAP:
      return 'UNI'
    case REWARDS_PLATFORMS.FUSESWAP:
      return 'FS'
    case REWARDS_PLATFORMS.PANCAKESWAP:
      return 'CAKE'
    case REWARDS_PLATFORMS.FEGEX:
      return 'FEXex'
  }
}

const getHelpLinkFromNetworkId = (platform) => {
  switch (platform) {
    case REWARDS_PLATFORMS.UNISWAP:
    case REWARDS_PLATFORMS.FUSESWAP:
      return 'https://medium.com/fusenet/how-to-stake-eth-fuse-lp-tokens-for-fuse-rewards-fd9abe08f84c'
    case REWARDS_PLATFORMS.PANCAKESWAP:
      return 'https://docs.fuse.io/tutorials/adding-liquidity-on-pcs'
  }
}

const getHelpLinkFromPairName = (pairName) => {
  if (pairName === 'DEXT/FUSE') {
    return 'https://medium.com/fusenet/introducing-the-dext-fuse-liquidity-rewards-program-on-fuseswap-53bc6affd8bc'
  }
}

export const getAddLiquidityHelpLink = (networkId, pairName) => {
  const helpLinkFromPair = getHelpLinkFromPairName(pairName)
  if (helpLinkFromPair) {
    return helpLinkFromPair
  }

  return getHelpLinkFromNetworkId(networkId)
}

export const getCoingeckoId = (tokenAddress) => {
  return COINGECKO_ID_MAP[tokenAddress]
}

export const getReward = (rewardType) => {
  if (rewardType === 'single') {
    return SingleRewardProgram
  } else if (rewardType === 'multi') {
    return MultiRewardProgram
  }
}

export const getContracts = () => {
  return { ...CONFIG.contracts.main, ...CONFIG.contracts.fuse, ...CONFIG.contracts.bsc.pancake, ...CONFIG.contracts.bsc.fegex }
}

export const getContractRewardType = (address) => {
  const contracts = getContracts()
  return contracts[address].type
}

export const getRewards = (address) => {
  const contracts = getContracts()
  return contracts[address].rewards
}

export const getPlatformType = (address) => {
  const contracts = getContracts()
  return contracts[address].platform
}
