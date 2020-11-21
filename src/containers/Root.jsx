import React, { useEffect, useCallback } from 'react'
import ReactGA from 'react-ga'
import { useDispatch } from 'react-redux'
import { Switch, Route } from 'react-router'
import Header from '@/components/common/Header.jsx'
import Footer from '@/components/common/Footer.jsx'
import GoogleAnalyticsReporter from '@/components/analytics'
import ChooseStakingContract from '@/pages/ChooseStakingContract.jsx'
import StakingContract from '@/pages/StakingContract.jsx'
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

  // const handleLogout = useCallback(web3connect?.core?.clearCachedProvider, [web3connect])

  const handleConnect = useCallback(() => {
    web3connect.toggleModal()
    ReactGA.event({
      category: 'action',
      action: 'Connect wallet',
      label: 'Connect wallet'
    })
  }, [web3connect])

  useEffect(() => {
    if (web3connect.core.cachedProvider) {
      web3connect.core.connect()
    }
  }, [])

  return (
    <>
      <Header handleConnect={handleConnect} />
      <Route component={GoogleAnalyticsReporter} />
      <Switch>
        <Route path='/staking-contract'>
          <StakingContract />
        </Route>
        <Route path='/'>
          <ChooseStakingContract handleConnect={handleConnect} />
        </Route>
      </Switch>
      <Footer />
    </>
  )
}
