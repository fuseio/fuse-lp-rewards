import { all, call, select } from 'redux-saga/effects'
import * as actions from '@/actions/mining'
import { tryTakeEvery } from './utils'
import { getWeb3 } from '@/services/web3'
import { Staking as StakingABI } from '@/constants/abi'
import { transactionFlow } from './transaction'

function* depositStake({ amount }) {
  const { accountAddress } = yield select(state => state.network)
  if (accountAddress) {
    const web3 = yield getWeb3()
    const basicTokenContract = new web3.eth.Contract(StakingABI, CONFIG.stakeToken)

    const transactionPromise = basicTokenContract.methods.stake(amount).send({
      from: accountAddress
    })

    const action = actions.DEPOSIT_STAKE
    yield call(transactionFlow, { transactionPromise, action })
  }
}

function* withdrawStake({ amount }) {
  const { accountAddress } = yield select(state => state.network)
  if (accountAddress) {
    console.log({ withdrawStake: CONFIG.rewardToken })
    const web3 = yield getWeb3()
    const basicTokenContract = new web3.eth.Contract(StakingABI, CONFIG.rewardToke)

    const transactionPromise = basicTokenContract.methods.withdrawStakeAndInterest(amount).send({
      from: accountAddress
    })

    const action = actions.WITHDRAW_STAKE
    yield call(transactionFlow, { transactionPromise, action })
  }
}

export default function* accountsSaga() {
  yield all([
    tryTakeEvery(actions.DEPOSIT_STAKE, depositStake),
    tryTakeEvery(actions.WITHDRAW_STAKE, withdrawStake),
  ])
}
