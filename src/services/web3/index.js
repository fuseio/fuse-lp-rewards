import Web3 from 'web3'

let givenWeb3

export const getWeb3 = ({ provider, networkType } = {}) => {
  if (networkType) {
    const web3 = web3ByNetworkType[networkType]
    return web3
  }

  if (provider) {
    givenWeb3 = null
    givenWeb3 = new Web3(provider)
    return givenWeb3
  }

  if (givenWeb3) return givenWeb3
}

export const fuse = new Web3(CONFIG.web3.fuseProvider)
export const main = new Web3(CONFIG.web3.ethereumProvider)

const web3ByNetworkType = {
  122: fuse,
  1: main
}

export default givenWeb3
