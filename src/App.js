
import React, { StrictMode } from 'react'
import { hot } from 'react-hot-loader'
import { Provider } from 'react-redux'
import Root from '@/containers/Root.jsx'
import { ConnectedRouter } from 'connected-react-router'
import rootSaga from '@/sagas/index'
import configureStore from './store/configureStore'

import ScrollToTopController from '@/hooks/useScrollToTopController'

const { store, history } = configureStore(window.__INITIAL_STATE__)

store.runSaga(rootSaga)

const App = () => {
  return (
    <StrictMode>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <ScrollToTopController>
            <Root />
          </ScrollToTopController>
        </ConnectedRouter>
      </Provider>
    </StrictMode>
  )
}

export default hot(module)(App)
