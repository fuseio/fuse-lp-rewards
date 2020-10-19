import * as actions from '@/actions/accounts'
import { CHECK_ACCOUNT_CHANGED, CONNECT_TO_WALLET } from '@/actions/network'
import union from 'lodash/union'

export const initialAccount = {
  balances: {},
  transactions: {},
  tokens: [],
}

const handlers = {
  [actions.BALANCE_OF_TOKEN.SUCCESS]: (state, action) => {
    const balances = { ...state.balances, [action.tokenAddress]: action.response.balanceOf }
    return { ...state, balances }
  },
  [actions.BALANCE_OF_NATIVE.SUCCESS]: (state, action) => {
    return { ...state, ...action.response }
  },
  [CHECK_ACCOUNT_CHANGED.SUCCESS]: (state, action) => ({ ...state, ...action.response }),
  [CONNECT_TO_WALLET.SUCCESS]: (state, action) => ({ ...state, providerInfo: { ...action.response.providerInfo } })
}

export default (state = {}, action) => {
  if (handlers.hasOwnProperty(action.type) && action.accountAddress) {
    const account = state[action.accountAddress] || initialAccount
    return { ...state, [action.accountAddress]: handlers[action.type](account, action) }
  }
  return state
}
