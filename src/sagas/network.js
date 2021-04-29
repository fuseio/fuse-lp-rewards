import { all, fork, call, put, takeEvery, select, take } from 'redux-saga/effects'
import { toChecksumAddress } from 'web3-utils'
import { getWeb3 as getWeb3Service } from '@/services/web3'
import * as actions from '@/actions/network'
import { balanceOfNative, balanceOfToken } from '@/actions/accounts'
import { getStakingContractsData } from '@/actions/staking'
import { getProviderInfo } from 'web3modal'
import { eventChannel } from 'redux-saga'
import { getNetwork } from '@/utils/network'

function * getNetworkTypeInternal (web3) {
  const networkId = yield web3.eth.net.getId()
  return { networkId }
}

function * watchNetworkChanges (provider) {
  const chan = eventChannel(emitter => {
    provider.on('chainChanged', (message) => emitter(message))
    return () => {
      provider.close().then(() => console.log('logout'))
    }
  })
  while (true) {
    const message = yield take(chan)
    if (!isNaN(message)) {
      const web3 = yield getWeb3Service({ provider })
      yield call(checkNetworkType, { web3 })
    }
  }
}

function * watchAccountChanges (provider) {
  const chan = eventChannel(emitter => {
    provider.on('accountsChanged', (message) => emitter(message))
    return () => {
      provider.close().then(() => console.log('accountsChanged'))
    }
  })
  while (true) {
    const message = yield take(chan)
    if (!isNaN(message)) {
      const web3 = yield getWeb3Service({ provider })
      yield call(connectToWallet, { web3 })
    }
  }
}

function * connectToWallet () {
  const web3 = yield getWeb3Service()
  const provider = web3.currentProvider

  try {
    if (provider.isMetaMask) {
      provider.autoRefreshOnNetworkChange = false
    }

    const providerInfo = getProviderInfo(provider)

    const accounts = yield web3.eth.getAccounts()
    const accountAddress = accounts[0]

    yield fork(watchNetworkChanges, provider)
    yield fork(watchAccountChanges, provider)
    yield call(checkNetworkType, { web3, accountAddress })

    yield put({
      type: actions.CONNECT_TO_WALLET.SUCCESS,
      accountAddress,
      response: {
        providerInfo
      }
    })

    yield call(checkAccountChanged, { selectedAddress: accountAddress })
  } catch (error) {
    yield put({
      type: actions.CONNECT_TO_WALLET.FAILURE
    })
  }
}

function * checkNetworkType ({ web3, accountAddress }) {
  try {
    if (!accountAddress) {
      accountAddress = yield select(state => state.network.accountAddress)
    }
    const { networkType, networkId } = yield getNetworkTypeInternal(web3)
    const response = {
      networkType,
      networkId,
      accountAddress
    }
    yield put({
      type: actions.CHECK_NETWORK_TYPE.SUCCESS,
      response
    })
    yield put(balanceOfNative(accountAddress))
    yield put(balanceOfToken(CONFIG.rewardTokens['1']))
    yield put(balanceOfToken(CONFIG.rewardTokens['122']))
    yield put(getStakingContractsData())
  } catch (error) {
    yield put({ type: actions.CHECK_NETWORK_TYPE.FAILURE, error })
    yield put({
      type: 'ERROR',
      error
    })
  }
}

function * checkAccountChanged ({ selectedAddress }) {
  const accountAddress = yield select(state => state.network.accountAddress)
  const checksummedAddress = selectedAddress && toChecksumAddress(selectedAddress)

  if (accountAddress !== checksummedAddress) {
    yield put({
      type: checksummedAddress ? actions.CHECK_ACCOUNT_CHANGED.SUCCESS : actions.ACCOUNT_LOGGED_OUT,
      accountAddress: checksummedAddress,
      response: {
        accountAddress: checksummedAddress
      }
    })
    return true
  }
  return false
}

function * switchNetwork ({ networkId }) {
  try {
    const web3 = yield getWeb3Service()
    const provider = web3.currentProvider
    const network = getNetwork(networkId)
    
    const response = yield call(provider.request, {
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: network.chainId,
          chainName: network.chainName,
          nativeCurrency: network.nativeCurrency,
          rpcUrls: [network.rpc],
          blockExplorerUrls: [network.explorer]
        }
      ]
    })

    if (response == null) {
      yield put({ type: actions.SWITCH_NETWORK.SUCCESS, response })
    } else {
      yield put({ type: actions.SWITCH_NETWORK.FAILURE, error: response })
    }
  } catch (error) {
    yield put({ type: actions.SWITCH_NETWORK.FAILURE, error })
  }
}

export default function * web3Saga () {
  yield all([
    takeEvery(actions.CHECK_NETWORK_TYPE.REQUEST, checkNetworkType),
    takeEvery(actions.CONNECT_TO_WALLET.REQUEST, connectToWallet),
    takeEvery(actions.CHECK_ACCOUNT_CHANGED.REQUEST, checkAccountChanged),
    takeEvery(actions.SWITCH_NETWORK.REQUEST, switchNetwork)
  ])
}
