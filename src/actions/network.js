import { requestAction, createRequestTypes } from './utils'

export const CHECK_NETWORK_TYPE = createRequestTypes('CHECK_NETWORK_TYPE')
export const CONNECT_TO_WALLET = createRequestTypes('CONNECT_TO_WALLET')
export const DISCONNECT_WALLET = createRequestTypes('DISCONNECT_WALLET')

export const GET_BLOCK_NUMBER = createRequestTypes('GET_BLOCK_NUMBER')

export const CHANGE_NETWORK = createRequestTypes('CHANGE_NETWORK')
export const UNSUPPORTED_NETWORK_ERROR = 'UNSUPPORTED_NETWORK_ERROR'

export const CHECK_ACCOUNT_CHANGED = createRequestTypes('CHECK_ACCOUNT_CHANGED')
export const ACCOUNT_LOGGED_OUT = 'ACCOUNT_LOGGED_OUT'

export const SWITCH_NETWORK = createRequestTypes('SWITCH_NETWORK')

export const checkNetworkType = (enableProvider, provider) => requestAction(CHECK_NETWORK_TYPE, { provider, enableProvider })
export const connectToWallet = () => requestAction(CONNECT_TO_WALLET)
export const disconnectWallet = () => requestAction(DISCONNECT_WALLET)

export const getBlockNumber = (networkType, bridgeType) => requestAction(GET_BLOCK_NUMBER, { networkType, bridgeType })

export const changeNetwork = (networkType) => requestAction(CHANGE_NETWORK, { networkType })
export const checkAccountChanged = (selectedAddress) => requestAction(CHECK_ACCOUNT_CHANGED,
  { selectedAddress })

export const switchNetwork = (networkId) => requestAction(SWITCH_NETWORK, { networkId })
