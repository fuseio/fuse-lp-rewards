import { all, call, select, put, takeEvery } from 'redux-saga/effects'
import * as actions from '@/actions/staking'
import { tryTakeEvery } from './utils'
import { getWeb3 } from '@/services/web3'
import { transactionFlow } from './transaction'
import { BasicToken as BasicTokenABI, Staking as StakingABI } from '@/constants/abi'
import { balanceOfToken } from '@/actions/accounts'

function * approveToken ({ amount }) {
  const tokenAddress = CONFIG.stakeToken
  const { accountAddress } = yield select(state => state.network)
  const web3 = yield getWeb3()
  const basicToken = new web3.eth.Contract(BasicTokenABI, tokenAddress)

  const transactionPromise = basicToken.methods.approve(CONFIG.stakingContract, amount).send({
    from: accountAddress
  })

  const action = actions.APPROVE_TOKEN
  yield call(transactionFlow, { transactionPromise, action, tokenAddress })
}

function * getAllowance () {
  const { accountAddress } = yield select(state => state.network)
  if (accountAddress) {
    const tokenAddress = CONFIG.stakeToken
    const web3 = yield getWeb3()
    const basicToken = new web3.eth.Contract(BasicTokenABI, tokenAddress)
    const allowance = yield call(basicToken.methods.allowance(accountAddress, CONFIG.stakingContract).call)
    yield put({
      type: actions.GET_TOKEN_ALLOWANCE.SUCCESS,
      accountAddress,
      tokenAddress,
      response: {
        allowance
      }
    })
  }
}

function * depositStake ({ amount }) {
  const { accountAddress } = yield select(state => state.network)
  if (accountAddress) {
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
      response: { totalStaked: stakeData[0], depositAmount: stakeData[1] }
    })
  }
}

function * getStatsData () {
  const { accountAddress } = yield select(state => state.network)
  if (accountAddress) {
    const web3 = yield getWeb3()
    const basicTokenContract = new web3.eth.Contract(StakingABI, CONFIG.stakingContract)

    const statsData = yield call(basicTokenContract.methods.getStatsData(accountAddress).call)
    yield put({
      type: actions.GET_STATS_DATA.SUCCESS,
      accountAddress,
      response: { accruedRewards: statsData[4] }
    })
  }
}

function * refetchBalance () {
  const { accountAddress } = yield select(state => state.network)
  yield put(balanceOfToken(CONFIG.rewardToken, accountAddress))
  yield put(balanceOfToken(CONFIG.stakeToken, accountAddress))
  yield put(actions.getStakerData())
  yield put(actions.getStatsData())
}

function * approveTokenSuccess () {
  yield put(actions.getTokenAllowance())
}

export default function * accountsSaga () {
  yield all([
    tryTakeEvery(actions.DEPOSIT_STAKE, depositStake),
    tryTakeEvery(actions.WITHDRAW_STAKE, withdrawStake),
    tryTakeEvery(actions.APPROVE_TOKEN, approveToken, 1),
    tryTakeEvery(actions.GET_TOKEN_ALLOWANCE, getAllowance, 1),
    tryTakeEvery(actions.GET_STAKE_DATA, getStakingData, 1),
    tryTakeEvery(actions.GET_STATS_DATA, getStatsData, 1),
    takeEvery([actions.WITHDRAW_STAKE.SUCCESS, actions.DEPOSIT_STAKE.SUCCESS], refetchBalance),
    takeEvery([actions.APPROVE_TOKEN.SUCCESS], approveTokenSuccess)
  ])
}
