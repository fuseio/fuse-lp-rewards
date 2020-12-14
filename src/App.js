
import React, { StrictMode } from 'react'
import { hot } from 'react-hot-loader'
import { ModalProvider } from 'react-modal-hook'
import Modal from 'react-modal'
import { TransitionGroup } from 'react-transition-group'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { PersistGate } from 'redux-persist/integration/react'
import rootSaga from '@/sagas/index'
import configureStore from '@/store/configureStore'
import ScrollToTopController from '@/hooks/useScrollToTopController'
import Root from '@/containers/Root.jsx'

const { store, history, persistor } = configureStore(window.__INITIAL_STATE__)

store.runSaga(rootSaga)

Modal.setAppElement('#root')

const App = () => {
  return (
    <StrictMode>
      <ModalProvider rootComponent={TransitionGroup}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ConnectedRouter history={history}>
              <ScrollToTopController>
                <Root />
              </ScrollToTopController>
            </ConnectedRouter>
          </PersistGate>
        </Provider>
      </ModalProvider>
    </StrictMode>
  )
}

export default hot(module)(App)
