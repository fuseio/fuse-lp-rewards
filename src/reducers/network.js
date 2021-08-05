import * as network from '@/actions/network'

export default (state = {}, action) => {
  switch (action.type) {
    case network.CONNECT_TO_WALLET.REQUEST:
      return { ...state, connectingToWallet: true }
    case network.CONNECT_TO_WALLET.SUCCESS:
      return { ...state, providerInfo: action.response.providerInfo, connectingToWallet: false }
    case network.DISCONNECT_WALLET.SUCCESS:
      return { ...state, providerInfo: action.response.providerInfo }
    case network.CONNECT_TO_WALLET.FAILURE:
      return { ...state, connectingToWallet: false }
    case network.CHECK_ACCOUNT_CHANGED.SUCCESS:
      return { ...state, ...action.response }
    case network.ACCOUNT_LOGGED_OUT:
      return { ...state, ...action.response }
    case network.CHECK_NETWORK_TYPE.SUCCESS:
      return { ...state, ...action.response }
    case network.GET_BLOCK_NUMBER.SUCCESS:
      return { ...state, [action.networkType]: { ...state[action.networkType], ...action.response } }
    default:
      return state
  }
}
