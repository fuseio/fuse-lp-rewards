import { ApolloClient, InMemoryCache } from '@apollo/client'

export const uniswapClient = new ApolloClient({
  uri: `${CONFIG.api.graph.uniswap.url}${CONFIG.api.graph.uniswap.subgraphs.v2}`,
  cache: new InMemoryCache()
})

export const fuseswapClient = new ApolloClient({
  uri: `${CONFIG.api.graph.fuseswap.url}${CONFIG.api.graph.fuseswap.subgraphs.fuseswap}`,
  cache: new InMemoryCache()
})

export const pancakeswapClient = new ApolloClient({
  uri: `${CONFIG.api.graph.pancakeswap.url}${CONFIG.api.graph.pancakeswap.exchange}`,
  cache: new InMemoryCache()
})
