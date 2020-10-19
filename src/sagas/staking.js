import { all, call, select, put, takeEvery } from 'redux-saga/effects'
import * as actions from '@/actions/staking'
import { tryTakeEvery } from './utils'
import { getWeb3 } from '@/services/web3'
import { transactionFlow } from './transaction'
import { BasicToken as BasicTokenABI, Staking as StakingABI } from '@/constants/abi'
import { BigNumber } from 'bignumber.js'
import { balanceOfToken } from '@/actions/accounts'

function * approveToken ({ tokenAddress, amountToApprove }) {
  const { accountAddress } = yield select(state => state.network)
  const web3 = yield getWeb3()
  const basicToken = new web3.eth.Contract(BasicTokenABI, tokenAddress)

  const transactionPromise = basicToken.methods.approve(CONFIG.stakingContract, amountToApprove).send({
    from: accountAddress
  })

  const action = actions.APPROVE_TOKEN
  const receipt = yield call(transactionFlow, { transactionPromise, action, tokenAddress })
  return receipt
}

function * getAllowance ({ tokenAddress }) {
  const { accountAddress } = yield select(state => state.network)
  if (accountAddress) {
    const web3 = yield getWeb3()
    const basicToken = new web3.eth.Contract(BasicTokenABI, tokenAddress)
    const allowance = yield call(basicToken.methods.allowance(accountAddress, CONFIG.stakingContract).call)
    yield put({
      type: actions.GET_TOKEN_ALLOWANCE.SUCCESS,
      tokenAddress,
      response: {
        allowance
      }
    })

    return allowance
  }
}

function * depositStake ({ amount }) {
  const { accountAddress } = yield select(state => state.network)
  if (accountAddress) {
    const amountAllowed = yield call(getAllowance, { tokenAddress: CONFIG.stakeToken })
    if (new BigNumber(amountAllowed).isLessThan(new BigNumber(amount))) {
      yield call(approveToken, { tokenAddress: CONFIG.stakeToken, amountToApprove: amount })
    }
    const web3 = yield getWeb3()
    const basicTokenContract = new web3.eth.Contract(StakingABI, CONFIG.stakingContract)

    const transactionPromise = basicTokenContract.methods.stake(amount).send({
      from: accountAddress
    })

    const action = actions.DEPOSIT_STAKE
    yield call(transactionFlow, { transactionPromise, action })
  }
}

function * withdrawStake ({ amount }) {
  const { accountAddress } = yield select(state => state.network)
  if (accountAddress) {
    const web3 = yield getWeb3()
    const basicTokenContract = new web3.eth.Contract(StakingABI, CONFIG.stakingContract)

    const transactionPromise = basicTokenContract.methods.withdrawStakeAndInterest(amount).send({
      from: accountAddress
    })

    const action = actions.WITHDRAW_STAKE
    yield call(transactionFlow, { transactionPromise, action })
  }
}

function * getStakingData () {
  const { accountAddress } = yield select(state => state.network)
  if (accountAddress) {
    const web3 = yield getWeb3()
    const basicTokenContract = new web3.eth.Contract(StakingABI, CONFIG.stakingContract)

    const stakeData = yield call(basicTokenContract.methods.getStakerData(accountAddress).call)
    yield put({
      type: actions.GET_STAKE_DATA.SUCCESS,
      accountAddress,
      response: { amountStaked: stakeData[0] }
    })
  }
}

function * refetchBalance () {
  const { accountAddress } = yield select(state => state.network)
  yield put(balanceOfToken(CONFIG.rewardToken, accountAddress))
  yield put(balanceOfToken(CONFIG.stakeToken, accountAddress))
  yield put(actions.getStakerData())
}

export default function * accountsSaga () {
  yield all([
    tryTakeEvery(actions.DEPOSIT_STAKE, depositStake),
    tryTakeEvery(actions.WITHDRAW_STAKE, withdrawStake),
    tryTakeEvery(actions.APPROVE_TOKEN, approveToken, 1),
    tryTakeEvery(actions.GET_TOKEN_ALLOWANCE, getAllowance, 1),
    tryTakeEvery(actions.GET_STAKE_DATA, getStakingData, 1),
    takeEvery([actions.WITHDRAW_STAKE.SUCCESS, actions.DEPOSIT_STAKE.SUCCESS], refetchBalance)
  ])
}
