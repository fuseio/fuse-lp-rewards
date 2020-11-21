import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import createSagaMiddleware, { END } from 'redux-saga'
import { createBrowserHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'

import createRootReducer from '../reducers'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['staking']
}

export default function configureStore (initialState) {
  const history = createBrowserHistory()
  const sagaMiddleware = createSagaMiddleware({})

  const store = createStore(
    persistReducer(
      persistConfig,
      createRootReducer(history)
    ),
    initialState,
    applyMiddleware(
      routerMiddleware(history),
      sagaMiddleware
    )
  )

  store.runSaga = sagaMiddleware.run
  store.close = () => store.dispatch(END)
  const persistor = persistStore(store)
  return { store, history, persistor }
}
