import { REHYDRATE } from 'redux-persist/lib/constants'
import * as staking from '@/actions/staking'

export default (state = {}, action) => {
  switch (action.type) {
    case staking.SELECT_STAKING_CONTRACT:
      return { ...state, ...action.stakingContractData }
    case REHYDRATE:
      return { ...state, ...action.payload.staking }
    default:
      return state
  }
}
