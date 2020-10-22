
import React, { StrictMode } from 'react'
import { hot } from 'react-hot-loader'
import { ModalProvider } from 'react-modal-hook'
import Modal from 'react-modal'
import { TransitionGroup } from 'react-transition-group'
import { Provider } from 'react-redux'
import { ApolloProvider } from '@apollo/client'
import Root from '@/containers/Root.jsx'
import { ConnectedRouter } from 'connected-react-router'
import rootSaga from '@/sagas/index'
import configureStore from '@/store/configureStore'
import ScrollToTopController from '@/hooks/useScrollToTopController'
import { client } from '@/services/graphql'

const { store, history } = configureStore(window.__INITIAL_STATE__)

store.runSaga(rootSaga)

Modal.setAppElement('#root')

const App = () => {
  return (
    <StrictMode>
      <ModalProvider rootComponent={TransitionGroup}>
        <ApolloProvider client={client}>
          <Provider store={store}>
            <ConnectedRouter history={history}>
              <ScrollToTopController>
                <Root />
              </ScrollToTopController>
            </ConnectedRouter>
          </Provider>
        </ApolloProvider>
      </ModalProvider>
    </StrictMode>
  )
}

export default hot(module)(App)
