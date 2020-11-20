import * as staking from '@/actions/staking'

export default (state = {}, action) => {
  switch (action.type) {
    case staking.SELECT_STAKING_CONTRACT:
      return { ...state, ...action.stakingContractData }
    default:
      return state
  }
}
