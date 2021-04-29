import { combineReducers } from 'redux'

import withdraw from './withdraw'
import deposit from './deposit'
import home from './home'

const screensReducer = combineReducers({
  withdraw,
  deposit,
  home
})

export default screensReducer
