import request from 'superagent'

export const getTokenPrice = (tokenAddress, vsCurrencies = 'usd') => {
  return request.get(`https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${tokenAddress}&vs_currencies=${vsCurrencies}`)
    .then(response => response.body)
}

export const getTokenPriceById = (id) => {
  return request.get(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`)
    .then(response => response.body[id])
}

export const getFusePrice = () => {
  const fuseToken = CONFIG.rewardTokens['1']
  return getTokenPrice(fuseToken)
}
