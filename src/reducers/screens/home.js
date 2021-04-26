import { REHYDRATE } from 'redux-persist/lib/constants'
import get from 'lodash/get'
import * as staking from '@/actions/staking'
import { REWARDS_PLATFORMS } from '@/constants'

const initialState = {
	stakingPlatform: REWARDS_PLATFORMS.UNISWAP
}

export default (state = initialState, action) => {
    switch (action.type) {
			case staking.SELECT_STAKING_PLATFORM:
				const { stakingPlatform } = action
				return { ...state, stakingPlatform }
			case REHYDRATE:
				console.log('action', action)
				return { ...state, ...get(action, 'payload.staking') }
      default:
        return state
    }
}