import { networkIds } from '@/utils/network'
import { REWARDS_PLATFORMS } from '@/constants'

const getPairPath = (pairs) => {
  return String(pairs).split(',').join('/')
}

const getPlatformBaseUrl = (networkId) => {
  switch (networkId) {
    case networkIds.MAINNET:
      return 'https://app.uniswap.org'
    case networkIds.FUSE:
      return 'https://fuseswap.com'
    case networkIds.BSC:
      return 'https://exchange.pancakeswap.finance'
  }
}

export const getAddLiquidityLink = (pairs, networkId) => {
  return getPlatformBaseUrl(networkId) + '/#/add/' + getPairPath(pairs)
}

export const getPlatformName = (networkId) => {
  switch (networkId) {
    case networkIds.MAINNET:
      return REWARDS_PLATFORMS.UNISWAP
    case networkIds.FUSE:
      return REWARDS_PLATFORMS.FUSESWAP
    case networkIds.BSC:
      return REWARDS_PLATFORMS.PANCAKESWAP
  }
}

export const getRewardTokenName = (networkId) => {
  return networkId === networkIds.MAINNET || networkId === networkIds.BSC 
    ? 'FUSE' 
    : 'WFUSE'
}

export const getPlatformPairName = (networkId) => {
  switch (networkId) {
    case networkIds.MAINNET:
      return 'UNI'
    case networkIds.FUSE:
      return 'FS'
    case networkIds.BSC:
      return 'CAKE'
  }
}
