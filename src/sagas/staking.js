import { all, call, select, put, takeEvery } from 'redux-saga/effects'
import * as actions from '@/actions/staking'
import { tryTakeEvery } from './utils'
import { getWeb3 } from '@/services/web3'
import { transactionFlow } from './transaction'
import { BasicToken as BasicTokenABI, Staking as StakingABI } from '@/constants/abi'
import { balanceOfToken } from '@/actions/accounts'
import { BigNumber } from 'bignumber.js'
import { fetchPairInfo } from '@/services/api/uniswap'
import { getTokenPrice } from '@/services/api/coingecko'
import get from 'lodash/get'
import { formatWeiToNumber } from '@/utils/format'

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
      response: {
        totalStaked: stakeData[0],
        withdrawnToDate: stakeData[1]
      }
    })
  }
}

function * getStatsData () {
  const { accountAddress } = yield select(state => state.network)
  const { totalStaked = 0 } = yield select(state => state.staking)
  if (accountAddress) {
    const web3 = yield getWeb3()
    const basicTokenContract = new web3.eth.Contract(StakingABI, CONFIG.stakingContract)

    const statsData = yield call(basicTokenContract.methods.getStatsData(accountAddress).call)
    const { data } = yield call(fetchPairInfo, { address: '0x4ce3687fed17e19324f23e305593ab13bbd55c4d' })
    const tokenPrice = yield call(getTokenPrice, '0x970b9bb2c0444f5e81e9d0efb84c8ccdcdcaf84d')

    const globalTotalStake = statsData[0]
    const totalReward = statsData[1]
    const estimatedReward = statsData[2]
    const unlockedReward = statsData[3]
    const accruedRewards = statsData[4]
    const lockedRewards = new BigNumber(totalReward).minus(new BigNumber(unlockedReward))
    const rewardsPerToken = globalTotalStake !== '0' ? new BigNumber(lockedRewards).dividedBy(new BigNumber(globalTotalStake)) : 0
    const reserveUSD = get(data, 'pair.reserveUSD', 0)
    const totalSupply = get(data, 'pair.totalSupply', 0)
    const lpPrice = reserveUSD / totalSupply
    const totalStakeUSD = formatWeiToNumber(totalStaked) * lpPrice
    const totalRewardInUSD = formatWeiToNumber(totalReward) * tokenPrice['0x970b9bb2c0444f5e81e9d0efb84c8ccdcdcaf84d'].usd
    const apyPercent = (totalRewardInUSD / totalStakeUSD) * 26.07145 * 100
    yield put({
      type: actions.GET_STATS_DATA.SUCCESS,
      accountAddress,
      response: {
        globalTotalStake,
        totalReward,
        estimatedReward,
        unlockedReward,
        accruedRewards,
        lockedRewards,
        rewardsPerToken,
        totalStakeUSD,
        lpPrice,
        totalRewardInUSD,
        apyPercent
      }
    })
  }
}

function * withdrawInterest () {
  const { accountAddress } = yield select(state => state.network)
  if (accountAddress) {
    const web3 = yield getWeb3()
    const basicTokenContract = new web3.eth.Contract(StakingABI, CONFIG.stakingContract)

    const transactionPromise = basicTokenContract.methods.withdrawInterest().send({
      from: accountAddress
    })

    const action = actions.WITHDRAW_INTEREST
    yield call(transactionFlow, { transactionPromise, action })
  }
}
function * refetchBalance () {
  yield put(balanceOfToken(CONFIG.rewardToken))
  yield put(balanceOfToken(CONFIG.stakeToken))
  yield put(actions.getStakerData())
  yield put(actions.getStatsData())
}

function * approveTokenSuccess () {
  yield put(actions.getTokenAllowance())
}

function * withdrawInterestSuccess () {
  yield put(actions.getStakerData())
}

function * getStakingPeriod () {
  const { accountAddress } = yield select(state => state.network)
  if (accountAddress) {
    const web3 = yield getWeb3()
    const basicTokenContract = new web3.eth.Contract(StakingABI, CONFIG.stakingContract)

    const stakingPeriod = yield call(basicTokenContract.methods.stakingPeriod().call)
    const stakingStartTime = yield call(basicTokenContract.methods.stakingStartTime().call)
    yield put({
      type: actions.GET_STAKING_PERIOD.SUCCESS,
      accountAddress,
      response: {
        stakingPeriod,
        stakingStartTime
      }
    })
  }
}

export default function * accountsSaga () {
  yield all([
    tryTakeEvery(actions.WITHDRAW_INTEREST, withdrawInterest),
    tryTakeEvery(actions.DEPOSIT_STAKE, depositStake),
    tryTakeEvery(actions.WITHDRAW_STAKE, withdrawStake),
    tryTakeEvery(actions.APPROVE_TOKEN, approveToken, 1),
    tryTakeEvery(actions.GET_TOKEN_ALLOWANCE, getAllowance, 1),
    tryTakeEvery(actions.GET_STAKE_DATA, getStakingData, 1),
    tryTakeEvery(actions.GET_STATS_DATA, getStatsData, 1),
    tryTakeEvery(actions.GET_STAKING_PERIOD, getStakingPeriod, 1),
    takeEvery([actions.WITHDRAW_STAKE.SUCCESS, actions.DEPOSIT_STAKE.SUCCESS], refetchBalance),
    takeEvery([actions.APPROVE_TOKEN.SUCCESS], approveTokenSuccess),
    takeEvery([actions.WITHDRAW_INTEREST.SUCCESS], withdrawInterestSuccess)
  ])
}
