import { WITHDRAW_STAKE } from '@/actions/staking'

export default (state = {}, action) => {
  switch (action.type) {
    case WITHDRAW_STAKE.REQUEST:
      return { ...state, isWithdraw: true }
    case WITHDRAW_STAKE.SUCCESS:
      return { ...state, isWithdraw: false }
    case WITHDRAW_STAKE.FAILURE:
      return { ...state, isWithdraw: false, failReason: 'Oops' }

    default:
      return state
  }
}
