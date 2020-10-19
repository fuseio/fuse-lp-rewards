import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import network from './network'
import accounts from './accounts'

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  network,
  accounts,
})

export default createRootReducer
