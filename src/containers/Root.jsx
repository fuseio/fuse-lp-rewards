import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Switch, Route } from 'react-router'
import Header from '@/components/common/Header.jsx'
import HomePage from '@/components/home'
import { getWeb3 } from '@/services/web3'
import useWeb3Connect from '@/hooks/useWeb3Connect'
import { connectToWallet } from '@/actions/network'

export default () => {
  const dispatch = useDispatch()
  const onConnectCallback = (provider) => {
    getWeb3({ provider })
    dispatch(connectToWallet())
  }

  const web3connect = useWeb3Connect(onConnectCallback)

  // const handleLogout = React.useCallback(() => {
  //   web3connect.core.clearCachedProvider()
  // }, [web3connect])

  const handleConnect = React.useCallback(web3connect?.toggleModal, [web3connect])

  useEffect(() => {
    if (web3connect.core.cachedProvider) {
      web3connect.core.connect()
    }
  }, [])

  return (
    <>
      <Header handleConnect={handleConnect} />
      <Switch>
        <Route path='/'>
          <HomePage />
        </Route>
      </Switch>
    </>
  )
}
