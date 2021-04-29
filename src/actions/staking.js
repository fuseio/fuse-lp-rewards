import { action, createRequestTypes, createTransactionRequestTypes, requestAction } from './utils'

export const WITHDRAW_INTEREST = createTransactionRequestTypes('WITHDRAW_INTEREST')
export const WITHDRAW_STAKE = createTransactionRequestTypes('WITHDRAW_STAKE')
export const DEPOSIT_STAKE = createTransactionRequestTypes('DEPOSIT_STAKE')
export const APPROVE_TOKEN = createTransactionRequestTypes('APPROVE_TOKEN')
export const GET_TOKEN_ALLOWANCE = createRequestTypes('GET_TOKEN_ALLOWANCE')
export const GET_STATS_DATA = createRequestTypes('GET_STATS_DATA')
export const GET_STAKE_DATA = createRequestTypes('GET_STAKE_DATA')
export const GET_STAKING_PERIOD = createRequestTypes('GET_STAKING_PERIOD')
export const SELECT_STAKING_CONTRACT = 'SELECT_STAKING_CONTRACT'
export const GET_STAKING_CONTRACTS_DATA = createRequestTypes('GET_STAKING_CONTRACTS_DATA')
export const SELECT_STAKING_PLATFORM = 'SELECT_STAKING_PLATFORM'

export const withdrawInterest = () => action(WITHDRAW_INTEREST.REQUEST)
export const withdrawStakeAndInterest = (amount) => action(WITHDRAW_STAKE.REQUEST, { amount })
export const depositStake = (amount) => action(DEPOSIT_STAKE.REQUEST, { amount })
export const approveToken = (amount) => action(APPROVE_TOKEN.REQUEST, { amount })
export const getStakerData = (stakingContract, networkId) => action(GET_STAKE_DATA.REQUEST, { stakingContract, networkId })
export const getTokenAllowance = (stakingContract, tokenAddress, networkId) => requestAction(GET_TOKEN_ALLOWANCE, { stakingContract, tokenAddress, networkId })
export const getStatsData = (stakingContract, tokenAddress, networkId) => requestAction(GET_STATS_DATA, { stakingContract, tokenAddress, networkId })
export const getStakingPeriod = (stakingContract, networkId) => requestAction(GET_STAKING_PERIOD, { stakingContract, networkId })
export const selectStakingContract = (stakingContractData) => action(SELECT_STAKING_CONTRACT, { stakingContractData })
export const getStakingContractsData = () => action(GET_STAKING_CONTRACTS_DATA.REQUEST)
export const selectStakingPlatform = (stakingPlatform) => action(SELECT_STAKING_PLATFORM, { stakingPlatform })
