import { gql } from '@apollo/client'
import { uniswapClient, fuseswapClient, pancakeswapClient } from '@/services/graphql'
import { networkIds } from '@/utils/network'

const GET_PAIR_INFO = (address) => {
  return gql`
    {
      pair(id: "${address.toLowerCase()}") {
        untrackedVolumeUSD
        reserveETH
        reserveUSD
        token0Price
        token1Price
        volumeUSD
        liquidityProviderCount
        reserve0
        reserve1
        trackedReserveETH
        totalSupply
        token0 {
          id
          name
          symbol
        }
        token1 {
          id
          name
          symbol
        }
      }
    }
  `
}

export const fetchPairInfoUniswap = ({ address }) => uniswapClient.query({
  query: GET_PAIR_INFO(address)
})

export const fetchPairInfoFuseswap = ({ address }) => fuseswapClient.query({
  query: GET_PAIR_INFO(address)
})

export const fetchPairInfoPancakeswap = ({ address }) => pancakeswapClient.query({
  query: GET_PAIR_INFO(address)
})

export const fetchPairInfo = ({ address }, networkId) => {
  switch (networkId) {
    case networkIds.MAINNET:
      return fetchPairInfoUniswap({ address })
    case networkIds.FUSE:
      return fetchPairInfoFuseswap({ address })
    case networkIds.BSC:
      return fetchPairInfoPancakeswap({ address })
  }
}
