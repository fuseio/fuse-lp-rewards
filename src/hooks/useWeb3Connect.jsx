import { useState } from 'react'
import Web3Modal from 'web3modal'
import Torus from '@toruslabs/torus-embed'

const isDev = process.env.NODE_ENV === 'development'

const providerOptions = {
  metamask: {
  },
  torus: {
    package: Torus,
    options: {
      networkParams: {
        host: 'mainnet'
      },
      enableLogging: isDev,
      buttonPosition: 'top-right',
      config: {
        buildEnv: process.env.NODE_ENV
      }
    }
  }
}

const useWeb3Connect = (connectCallback) => {
  const [provider, setProvider] = useState()

  const web3Modal = new Web3Modal({
    network: 'ropsten',
    providerOptions,
    cacheProvider: true
  })

  web3Modal.on('connect', (provider) => {
    setProvider(provider)
    connectCallback(provider)
  })

  web3Modal.on('disconnected', () => {
    setProvider(null)
  })

  const toggleModal = () => {
    web3Modal.toggleModal()
  }

  return { provider, toggleModal, core: web3Modal }
}

export default useWeb3Connect
