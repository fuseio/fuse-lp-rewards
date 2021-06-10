import request from 'superagent'
import { BNB_COIN_ID } from '../../constants'
import { getCoingeckoId } from '../../utils'

export const getTokenPrice = (tokenAddress, vsCurrencies = 'usd') => {
  return request.get(`https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${tokenAddress}&vs_currencies=${vsCurrencies}`)
    .then(response => response.body)
}

export const getTokenPriceById = (id) => {
  return request.get(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`)
    .then(response => response.body[id].usd)
}

export const getFusePrice = () => {
  const fuseToken = CONFIG.rewardTokens['1']
  return getTokenPrice(fuseToken)
}

export const getBscTokenPrice = async (tokenAddress) => {
  const id = getCoingeckoId(tokenAddress)
  if (id == CONFIG.rewardTokens['1']) {
    return getFusePrice().then(price => price[id].usd)
  } else if (id === BNB_COIN_ID) {
    return getTokenPriceById(BNB_COIN_ID)
  } else {
    return getTokenPrice(id).then(price => price[id].usd)
  }
}
