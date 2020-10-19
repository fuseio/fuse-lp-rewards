
import React, { Fragment, useEffect, StrictMode } from "react";
import { hot } from 'react-hot-loader';
import { Provider, useDispatch } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { Switch, Route } from 'react-router'
import rootSaga from '@/sagas/index'
import configureStore from './store/configureStore'

import Header from '@/components/common/Header.jsx'
import HomePage from '@/components/home'
import { getWeb3 } from '@/services/web3'
import ScrollToTopController from '@/hooks/useScrollToTopController'
import useWeb3Connect from '@/hooks/useWeb3Connect'
import { connectToWallet } from '@/actions/network'

const { store, history } = configureStore(window.__INITIAL_STATE__)

store.runSaga(rootSaga)

const App = () => {
  const dispatch = useDispatch()
  const onConnectCallback = (provider) => {
    getWeb3({ provider })
    dispatch(connectToWallet())
  }

  const web3connect = useWeb3Connect(onConnectCallback)

  useEffect(() => {
    if (web3connect.core.cachedProvider) {
      web3connect.core.connect()
    }
  }, [])

  return (
    <Fragment>
      <Header web3connect={web3connect} />
      <Switch>
        <Route path='/'><HomePage /></Route>
      </Switch>
    </Fragment>
  )
}

const Main = () => {
  return (
    <StrictMode>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <ScrollToTopController>
            <App />
          </ScrollToTopController>
        </ConnectedRouter>
      </Provider>
    </StrictMode>
  )
}

export default hot(module)(Main)
