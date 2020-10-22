import { ApolloClient, InMemoryCache } from '@apollo/client'

export const client = new ApolloClient({
  uri: `${CONFIG.api.graph.url}${CONFIG.api.graph.subgraphs.v2}`,
  cache: new InMemoryCache()
})
