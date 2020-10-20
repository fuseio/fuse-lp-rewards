import { action, createRequestTypes, createTransactionRequestTypes, requestAction } from './utils'

export const WITHDRAW_STAKE = createTransactionRequestTypes('WITHDRAW_STAKE')
export const DEPOSIT_STAKE = createTransactionRequestTypes('DEPOSIT_STAKE')
export const APPROVE_TOKEN = createTransactionRequestTypes('APPROVE_TOKEN')
export const GET_TOKEN_ALLOWANCE = createRequestTypes('GET_TOKEN_ALLOWANCE')
export const GET_STATS_DATA = createRequestTypes('GET_STATS_DATA')
export const GET_STAKE_DATA = createRequestTypes('GET_STAKE_DATA')

export const withdrawStakeAndInterest = (amount) => action(WITHDRAW_STAKE.REQUEST, { amount })
export const depositStake = (amount) => action(DEPOSIT_STAKE.REQUEST, { amount })
export const approveToken = (amount) => action(APPROVE_TOKEN.REQUEST, { amount })
export const getStakerData = () => action(GET_STAKE_DATA.REQUEST)
export const getTokenAllowance = () => requestAction(GET_TOKEN_ALLOWANCE)
export const getStatsData = () => requestAction(GET_STATS_DATA)
