import { networkIds } from '@/utils/network'
import { REWARDS_PLATFORMS } from '@/constants'
import { COINGECKO_ID_MAP } from '../constants'

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

export const getAddLiquidityHelpLink = (networkId) => {
  switch (networkId) {
    case networkIds.MAINNET:
    case networkIds.FUSE:
      return 'https://medium.com/fusenet/how-to-stake-eth-fuse-lp-tokens-for-fuse-rewards-fd9abe08f84c'
    case networkIds.BSC:
      return 'https://docs.fuse.io/tutorials/adding-liquidity-on-pcs'
  }
}

export const getCoingeckoId = (tokenAddress) => {
  return COINGECKO_ID_MAP[tokenAddress]
}
