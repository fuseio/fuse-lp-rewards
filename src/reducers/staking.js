import { REHYDRATE } from 'redux-persist/lib/constants'
import get from 'lodash/get'
import * as staking from '@/actions/staking'

export default (state = {}, action) => {
  switch (action.type) {
    case staking.SELECT_STAKING_CONTRACT:
      return { ...state, ...action.stakingContractData }
    case REHYDRATE:
      return { ...state, ...get(action, 'payload.staking') }
    default:
      return state
  }
}
