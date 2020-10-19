import { createRequestTypes, action } from './utils'

export const WITHDRAW_STAKE = createRequestTypes('WITHDRAW_STAKE')
export const DEPOSIT_STAKE = createRequestTypes('DEPOSIT_STAKE')

export const withdrawStakeAndInterest = (amount) => action(WITHDRAW_STAKE.REQUEST, { amount })
export const depositStake = (amount) => action(DEPOSIT_STAKE.REQUEST, { amount })
