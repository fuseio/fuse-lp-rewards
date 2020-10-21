import { createRequestTypes, action } from './utils'

export const BALANCE_OF_TOKEN = createRequestTypes('BALANCE_OF_TOKEN')
export const BALANCE_OF_NATIVE = createRequestTypes('BALANCE_OF_NATIVE')

export const balanceOfToken = (tokenAddress) => action(BALANCE_OF_TOKEN.REQUEST, { tokenAddress })
export const balanceOfNative = (accountAddress) => action(BALANCE_OF_NATIVE.REQUEST, { accountAddress })
