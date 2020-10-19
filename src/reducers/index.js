import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import network from './network'
import accounts from './accounts'
import staking from './staking'

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  network,
  accounts,
  staking
})

export default createRootReducer
