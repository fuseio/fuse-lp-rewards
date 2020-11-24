import { BigNumber } from 'bignumber.js'
import replace from 'lodash/replace'

export const symbolFromPair = (pairName) => replace(pairName, '/', '-')

export const ROUND_PRECISION = 2
export const MAX_PRECISION = 18

const formatValue = (num) =>
  num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: num < 1 ? 18 : 4
  })

export const formatWeiToNumber = (value, decimals = 18) => new BigNumber(value).div(10 ** decimals).toNumber()
export const formatWei = (value, decimals = 18) => formatValue(new BigNumber(value).div(10 ** decimals).toNumber())

export const toWei = (value, decimals = 18) => {
  if (!value) {
    return 0
  }
  return new BigNumber(value).multipliedBy(10 ** decimals).toFixed()
}

export const addressShortener = (address) => address ? `${address.substring(0, 6)}...${address.substring(address.length - 4, address.length)}` : ''

export const formatNumber = (num) => String(num).replace(/(.)(?=(\d{3})+$)/g, '$1,')
