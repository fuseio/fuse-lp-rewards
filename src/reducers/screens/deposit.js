import { APPROVE_TOKEN, DEPOSIT_STAKE } from '@/actions/staking'
// import { formatWei } from '@/utils/format'

export default (state = {}, action) => {
  switch (action.type) {
    case APPROVE_TOKEN.REQUEST:
      return { ...state, isApproving: true }
    case APPROVE_TOKEN.SUCCESS:
      return { ...state, isApproving: false }
    case APPROVE_TOKEN.FAILURE:
      return { ...state, isApproving: false, failReason: 'Oops' }
    case DEPOSIT_STAKE.REQUEST:
      return { ...state, isDeposit: true }
    case DEPOSIT_STAKE.SUCCESS:
      return { ...state, isDeposit: false }
    case DEPOSIT_STAKE.FAILURE:
      return { ...state, isDeposit: false, failReason: 'Oops' }
    default:
      return state
  }
}
