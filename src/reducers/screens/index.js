import { combineReducers } from 'redux'

import withdraw from './withdraw'
import deposit from './deposit'

const screensReducer = combineReducers({
  withdraw,
  deposit
})

export default screensReducer
