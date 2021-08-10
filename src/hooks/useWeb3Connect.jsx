import { useState } from 'react'
import Web3Modal from 'web3modal'
import WalletConnectProvider from 'fuse-walletconnect-web3-provider'

const providerOptions = {
  metamask: {
  },
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      bridge: 'https://walletconnect.fuse.io',
      rpc: {
        1: 'https://mainnet.infura.io/v3/a7f50ee1a9e94ea3af446d76106ff515',
        56: 'https://bsc-dataseed.binance.org/',
        122: 'https://rpc.fuse.io'
      }
    }
  }
}

const useWeb3Connect = (connectCallback) => {
  const [provider, setProvider] = useState()

  const web3Modal = new Web3Modal({
    network: 'mainnet',
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
