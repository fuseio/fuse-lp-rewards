import { gql } from '@apollo/client'
import { client } from '@/services/graphql'

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
        }
        token1 {
          id
          name
        }
      }
    }
  `
}

export const fetchPairInfo = ({ address }) => client.query({
  query: GET_PAIR_INFO(address)
})
