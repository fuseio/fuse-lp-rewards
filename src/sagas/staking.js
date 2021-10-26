import { all, call, select, put, takeEvery } from 'redux-saga/effects'
import moment from 'moment'
import * as actions from '@/actions/staking'
import { tryTakeEvery } from './utils'
import { getWeb3 } from '@/services/web3'
import { getFegexStats } from '@/services/fegex'
import { transactionFlow } from './transaction'
import { BasicToken as BasicTokenABI } from '@/constants/abi'
import { balanceOfToken } from '@/actions/accounts'
import { ADDRESS_ZERO, REWARDS_PLATFORMS } from '@/constants'
import { getContractRewardType, getReward, getRewards, getContracts } from '../utils'

function * getStakingContractsData () {
  const object = getContracts()
  for (const stakingContract in object) {
    const { LPToken, networkId, platform } = object[stakingContract]
    yield put(actions.getTokenAllowance(stakingContract, LPToken, networkId))
    yield put(actions.getStakerData(stakingContract, networkId))
    yield put(actions.getStatsData(stakingContract, LPToken, networkId, platform))
    yield put(actions.getStakingPeriod(stakingContract, networkId))
    yield put(balanceOfToken(LPToken))
  }
}

function * approveToken ({ amount }) {
  const { accountAddress } = yield select(state => state.network)
  const { stakingContract, lpToken: tokenAddress } = yield select(state => state.staking)
  const web3 = yield getWeb3()
  const basicToken = new web3.eth.Contract(BasicTokenABI, tokenAddress)

  const transactionPromise = basicToken.methods.approve(stakingContract, amount).send({
    from: accountAddress
  })

  const action = actions.APPROVE_TOKEN
  yield call(transactionFlow, { transactionPromise, action, tokenAddress })
}

function * getAllowance ({ stakingContract, tokenAddress, networkId, blockNumber }) {
  const { accountAddress } = yield select(state => state.network)
  if (accountAddress) {
    const networkState = yield select(state => state.network)
    const web3 = yield getWeb3({ networkType: networkState.networkId === networkId ? null : networkId })
    const basicToken = new web3.eth.Contract(BasicTokenABI, tokenAddress)
    const allowance = yield call(basicToken.methods.allowance(accountAddress, stakingContract).call, {}, blockNumber)
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
  const { stakingContract } = yield select(state => state.staking)
  if (accountAddress) {
    const web3 = yield getWeb3()

    const rewardType = getContractRewardType(stakingContract)
    const RewardProgram = getReward(rewardType)
    const staking = new RewardProgram(stakingContract, web3)
    const transactionPromise = staking.deposit(amount, accountAddress)

    const action = actions.DEPOSIT_STAKE
    yield call(transactionFlow, { transactionPromise, action })
  }
}

function * withdrawStake ({ amount }) {
  const { accountAddress } = yield select(state => state.network)
  const { stakingContract } = yield select(state => state.staking)
  if (accountAddress) {
    const web3 = yield getWeb3()

    const rewardType = getContractRewardType(stakingContract)
    const RewardProgram = getReward(rewardType)
    const staking = new RewardProgram(stakingContract, web3)
    const transactionPromise = staking.withdraw(amount, accountAddress)

    const action = actions.WITHDRAW_STAKE
    yield call(transactionFlow, { transactionPromise, action })
  }
}

function * withdrawInterest () {
  const { accountAddress } = yield select(state => state.network)
  const { stakingContract } = yield select(state => state.staking)
  if (accountAddress) {
    const web3 = yield getWeb3()

    const rewardType = getContractRewardType(stakingContract)
    const RewardProgram = getReward(rewardType)
    const staking = new RewardProgram(stakingContract, web3)
    const transactionPromise = staking.withdrawReward(accountAddress)

    const action = actions.WITHDRAW_INTEREST
    yield call(transactionFlow, { transactionPromise, action })
  }
}

function * getStakingData ({ stakingContract, networkId }) {
  const { accountAddress } = yield select(state => state.network)
  if (accountAddress) {
    const networkState = yield select(state => state.network)
    const web3 = yield getWeb3({ networkType: networkState.networkId === networkId ? null : networkId })

    const rewardType = getContractRewardType(stakingContract)
    const RewardProgram = getReward(rewardType)
    const staking = new RewardProgram(stakingContract, web3.currentProvider)
    const stakeData = yield staking.getStakerInfo(accountAddress)

    yield put({
      type: actions.GET_STAKE_DATA.SUCCESS,
      accountAddress,
      entity: 'stakingContracts',
      response: {
        address: stakingContract,
        totalStaked: stakeData[0],
        withdrawnToDate: stakeData[1]
      }
    })
  }
}

function * getStatsData ({ stakingContract, tokenAddress, networkId, platform }) {
  const { accountAddress: activeAccountAddress } = yield select(state => state.network)
  const accountAddress = activeAccountAddress || ADDRESS_ZERO
  const networkState = yield select(state => state.network)
  const web3 = yield getWeb3({ networkType: networkState.networkId === networkId ? null : networkId })

  const rewardType = getContractRewardType(stakingContract)
  const RewardProgram = getReward(rewardType)
  const staking = new RewardProgram(stakingContract, web3)
  const rewards = rewardType === 'single' ? [CONFIG.rewardTokens[networkId]] : getRewards(stakingContract)
  
  let stats
  if (platform === REWARDS_PLATFORMS.FEGEX) {
    const stakeData = yield staking.getStakerInfo(accountAddress)
    const { duration, } = yield staking.getStakingTimes(rewards[0])
    stats = yield getFegexStats(stakingContract, tokenAddress, stakeData[0], duration, accountAddress, rewards, web3)
  } else {
    stats = yield staking.getStats(accountAddress, tokenAddress, networkId, rewards)
  }

  yield put({
    type: actions.GET_STATS_DATA.SUCCESS,
    accountAddress,
    entity: 'stakingContracts',
    response: {
      address: stakingContract,
      globalTotalStake: stats.globalTotalStake,
      totalReward: stats.rewardsInfo[0].totalRewards,
      estimatedReward: stats.rewardsInfo[0].estimatedRewards,
      unlockedReward: stats.unlockedRewards,
      accruedRewards: stats.rewardsInfo[0].accuruedRewards,
      lockedRewards: stats.lockedRewards,
      totalStakeUSD: stats.totalStakedUSD,
      globalTotalStakeUSD: stats.globalTotalStakeUSD,
      lpPrice: stats.pairPrice,
      totalRewardInUSD: stats.rewardsInfo[0].totalRewardsInUSD,
      apyPercent: stats.rewardsInfo[0].apyPercent * 100,
      token0: stats.token0,
      token1: stats.token1,
      reserve0: stats.reserve0,
      reserve1: stats.reserve1,
      rewardRate: stats.rewardsInfo[0].rewardRate
    }
  })
}

function * refetchBalance ({ response: { receipt } }) {
  const { blockNumber } = receipt
  const { lpToken, stakingContract, networkId, uniPairToken } = yield select(state => state.staking)
  yield put(balanceOfToken(CONFIG.rewardTokens[`${networkId}`], blockNumber))
  yield put(balanceOfToken(lpToken, blockNumber))
  yield put(actions.getStakerData(stakingContract, networkId))
  yield put(actions.getStatsData(stakingContract, networkId === 1 ? lpToken : uniPairToken))
}

function * approveTokenSuccess ({ response: { receipt } }) {
  const { blockNumber } = receipt
  const { lpToken, stakingContract, networkId } = yield select(state => state.staking)
  yield put(actions.getTokenAllowance(stakingContract, lpToken, networkId, blockNumber))
}

function * withdrawInterestSuccess () {
  yield put(actions.getStakerData())
}

function * getStakingPeriod ({ stakingContract, networkId }) {
  const { accountAddress } = yield select(state => state.network)
  const networkState = yield select(state => state.network)
  const web3 = yield getWeb3({ networkType: networkState.networkId === networkId ? null : networkId })

  const rewardType = getContractRewardType(stakingContract)
  const RewardProgram = getReward(rewardType)
  const staking = new RewardProgram(stakingContract, web3)
  const rewardToken = rewardType === 'multi' && CONFIG.rewardTokens[networkId] 
  const { start, duration, end } = yield staking.getStakingTimes(rewardToken)

  const isExpired = moment().isAfter(moment.unix(end))
  const isComingSoon = moment().isBefore(moment.unix(start))

  yield put({
    type: actions.GET_STAKING_PERIOD.SUCCESS,
    accountAddress,
    entity: 'stakingContracts',
    response: {
      address: stakingContract,
      isExpired,
      isComingSoon,
      stakingStartTime: start,
      stakingPeriod: duration,
      stakingEndTime: end
    }
  })
}

export default function * accountsSaga () {
  yield all([
    tryTakeEvery(actions.GET_STAKING_CONTRACTS_DATA, getStakingContractsData),
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
