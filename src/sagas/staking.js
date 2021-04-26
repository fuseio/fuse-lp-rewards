import { all, call, select, put, takeEvery } from 'redux-saga/effects'
import moment from 'moment'
import * as actions from '@/actions/staking'
import { tryTakeEvery } from './utils'
import { getWeb3 } from '@/services/web3'
import { transactionFlow } from './transaction'
import { BasicToken as BasicTokenABI, Staking as StakingABI } from '@/constants/abi'
import { balanceOfToken } from '@/actions/accounts'
import { BigNumber } from 'bignumber.js'
import { fetchPairInfoUniswap, fetchPairInfoFuseswap } from '@/services/api/uniswap'
import { getTokenPrice } from '@/services/api/coingecko'
import get from 'lodash/get'
import { toWei, formatWeiToNumber } from '@/utils/format'

function * getStakingContractsData () {
  const object = { ...CONFIG.contracts.main, ...CONFIG.contracts.fuse }
  for (const stakingContract in object) {
    const { LPToken, networkId } = object[stakingContract]
    yield put(actions.getTokenAllowance(stakingContract, LPToken, networkId))
    yield put(actions.getStakerData(stakingContract, networkId))
    yield put(actions.getStatsData(stakingContract, LPToken, networkId))
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

function * getAllowance ({ stakingContract, tokenAddress, networkId }) {
  const { accountAddress } = yield select(state => state.network)
  if (accountAddress) {
    const networkState = yield select(state => state.network)
    const web3 = yield getWeb3({ networkType: networkState.networkId === networkId ? null : networkId })
    const basicToken = new web3.eth.Contract(BasicTokenABI, tokenAddress)
    const allowance = yield call(basicToken.methods.allowance(accountAddress, stakingContract).call)
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
    const stakingContractInstance = new web3.eth.Contract(StakingABI, stakingContract)

    const transactionPromise = stakingContractInstance.methods.stake(amount).send({
      from: accountAddress
    })

    const action = actions.DEPOSIT_STAKE
    yield call(transactionFlow, { transactionPromise, action })
  }
}

function * withdrawStake ({ amount }) {
  const { accountAddress } = yield select(state => state.network)
  const { stakingContract } = yield select(state => state.staking)
  if (accountAddress) {
    const web3 = yield getWeb3()
    const stakingContractInstance = new web3.eth.Contract(StakingABI, stakingContract)

    const transactionPromise = stakingContractInstance.methods.withdrawStakeAndInterest(amount).send({
      from: accountAddress
    })

    const action = actions.WITHDRAW_STAKE
    yield call(transactionFlow, { transactionPromise, action })
  }
}

function * withdrawInterest () {
  const { accountAddress } = yield select(state => state.network)
  const { stakingContract } = yield select(state => state.staking)
  if (accountAddress) {
    const web3 = yield getWeb3()
    const stakingContractInstance = new web3.eth.Contract(StakingABI, stakingContract)

    const transactionPromise = stakingContractInstance.methods.withdrawInterest().send({
      from: accountAddress
    })

    const action = actions.WITHDRAW_INTEREST
    yield call(transactionFlow, { transactionPromise, action })
  }
}

function * getStakingData ({ stakingContract, networkId }) {
  const { accountAddress } = yield select(state => state.network)
  if (accountAddress) {
    const networkState = yield select(state => state.network)
    const web3 = yield getWeb3({ networkType: networkState.networkId === networkId ? null : networkId })
    const stakingContractInstance = new web3.eth.Contract(StakingABI, stakingContract)

    const stakeData = yield call(stakingContractInstance.methods.getStakerData(accountAddress).call)
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

function * getStatsData ({ stakingContract, tokenAddress, networkId }) {
  const { accountAddress } = yield select(state => state.network)
  const { totalStaked = 0 } = yield select(state => state.staking)
  if (accountAddress) {
    const networkState = yield select(state => state.network)
    const web3 = yield getWeb3({ networkType: networkState.networkId === networkId ? null : networkId })
    const stakingContractInstance = new web3.eth.Contract(StakingABI, stakingContract)

    const statsData = yield call(stakingContractInstance.methods.getStatsData(accountAddress).call)
    const fuseToken = CONFIG.rewardTokens['1']
    const pairInfoFetcher = networkId === 122 ? fetchPairInfoFuseswap : fetchPairInfoUniswap
    const { data } = yield call(pairInfoFetcher, { address: tokenAddress })

    const stakingPeriod = yield call(stakingContractInstance.methods.stakingPeriod().call)
    const tokenPrice = yield call(getTokenPrice, fuseToken)
    const globalTotalStake = statsData[0]
    const totalReward = statsData[1]
    const estimatedReward = statsData[2]
    const unlockedReward = statsData[3]
    const accruedRewards = statsData[4]
    const lockedRewards = new BigNumber(totalReward).minus(new BigNumber(unlockedReward))
    const fusePrice = tokenPrice[fuseToken].usd
    const totalRewardInUSD = formatWeiToNumber(totalReward) * fusePrice
    const reserveUSD = get(data, 'pair.reserveUSD', 0)
    const totalSupply = get(data, 'pair.totalSupply', 0)
    const token0 = get(data, 'pair.token0', {})
    const token1 = get(data, 'pair.token1', {})
    const totalReserve0 = get(data, 'pair.reserve0', 0)
    const totalReserve1 = get(data, 'pair.reserve1', 0)
    const reserve0 = new BigNumber(globalTotalStake).div(toWei(totalSupply)).multipliedBy(toWei(totalReserve0))
    const reserve1 = new BigNumber(globalTotalStake).div(toWei(totalSupply)).multipliedBy(toWei(totalReserve1))

    const lpPrice = reserveUSD / totalSupply
    const totalStakeUSD = formatWeiToNumber(totalStaked) * lpPrice
    const globalTotalStakeUSD = formatWeiToNumber(globalTotalStake) * lpPrice
    const stakingPeriodInDays = Number(stakingPeriod) / (3600 * 24)
    const apyPercent = (totalRewardInUSD / globalTotalStakeUSD) * (365 / stakingPeriodInDays) * 100
    yield put({
      type: actions.GET_STATS_DATA.SUCCESS,
      accountAddress,
      entity: 'stakingContracts',
      response: {
        address: stakingContract,
        globalTotalStake,
        totalReward,
        estimatedReward,
        unlockedReward,
        accruedRewards,
        lockedRewards,
        totalStakeUSD,
        globalTotalStakeUSD,
        lpPrice,
        totalRewardInUSD,
        apyPercent,
        token0,
        token1,
        reserve0,
        reserve1
      }
    })
  }
}

function * refetchBalance () {
  const { lpToken, stakingContract, networkId, uniPairToken } = yield select(state => state.staking)
  yield put(balanceOfToken(CONFIG.rewardTokens[`${networkId}`]))
  yield put(balanceOfToken(lpToken))
  yield put(actions.getStakerData(stakingContract, networkId))
  yield put(actions.getStatsData(stakingContract, networkId === 1 ? lpToken : uniPairToken))
}

function * approveTokenSuccess () {
  const { lpToken, stakingContract, networkId } = yield select(state => state.staking)
  yield put(actions.getTokenAllowance(stakingContract, lpToken, networkId))
}

function * withdrawInterestSuccess () {
  yield put(actions.getStakerData())
}

function * getStakingPeriod ({ stakingContract, networkId }) {
  const { accountAddress } = yield select(state => state.network)
  if (accountAddress) {
    const networkState = yield select(state => state.network)
    const web3 = yield getWeb3({ networkType: networkState.networkId === networkId ? null : networkId })
    const basicTokenContract = new web3.eth.Contract(StakingABI, stakingContract)

    const stakingPeriod = yield call(basicTokenContract.methods.stakingPeriod().call)
    const stakingStartTime = yield call(basicTokenContract.methods.stakingStartTime().call)
    const isExpired = moment().isAfter(moment.unix(Number(stakingStartTime) + Number(stakingPeriod)))
    const isComingSoon = moment().isBefore(moment.unix(Number(stakingStartTime)))

    yield put({
      type: actions.GET_STAKING_PERIOD.SUCCESS,
      accountAddress,
      entity: 'stakingContracts',
      response: {
        address: stakingContract,
        stakingPeriod,
        isExpired,
        stakingStartTime,
        isComingSoon
      }
    })
  }
}

function * selectStakingPlatform ({ stakingPlatform }) {
  yield put(ac)
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
