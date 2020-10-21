import { all, put, call, takeEvery, select } from 'redux-saga/effects'
import * as actions from '@/actions/accounts'
import { tryTakeEvery } from './utils'
import { CHECK_ACCOUNT_CHANGED } from '@/actions/network'
import { getWeb3 } from '@/services/web3'
import { BasicToken as BasicTokenABI } from '@/constants/abi'

function * balanceOfToken ({ tokenAddress }) {
  const { accountAddress } = yield select(state => state.network)
  if (tokenAddress) {
    const web3 = yield getWeb3()
    const basicTokenContract = new web3.eth.Contract(BasicTokenABI, tokenAddress)
    const balanceOf = yield call(basicTokenContract.methods.balanceOf(accountAddress).call)

    yield put({
      type: actions.BALANCE_OF_TOKEN.SUCCESS,
      tokenAddress,
      accountAddress,
      response: { balanceOf }
    })
  }
}

function * balanceOfNative ({ accountAddress }) {
  if (accountAddress) {
    const web3 = yield getWeb3()
    const balanceOfNative = yield call(web3.eth.getBalance, accountAddress)

    yield put({
      type: actions.BALANCE_OF_NATIVE.SUCCESS,
      accountAddress,
      response: { balanceOfNative }
    })
  }
}

function * watchAccountChanged ({ response }) {
  yield put(actions.balanceOfNative(response.accountAddress))
}

export default function * accountsSaga () {
  yield all([
    tryTakeEvery(actions.BALANCE_OF_TOKEN, balanceOfToken),
    tryTakeEvery(actions.BALANCE_OF_NATIVE, balanceOfNative),
    takeEvery(CHECK_ACCOUNT_CHANGED.SUCCESS, watchAccountChanged)
  ])
}
