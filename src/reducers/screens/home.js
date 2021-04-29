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
			default:
        return state
    }
}