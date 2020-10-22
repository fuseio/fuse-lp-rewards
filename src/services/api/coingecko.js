import request from 'superagent'

export const getTokenPrice = (tokenAddress, vsCurrencies = 'usd') => {
  return request.get(`https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${tokenAddress}&vs_currencies=${vsCurrencies}`)
    .then(response => response.body)
}
