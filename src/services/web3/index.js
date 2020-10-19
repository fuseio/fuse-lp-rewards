import Web3 from 'web3'

let givenWeb3

export const getWeb3 = ({ provider } = {}) => {
  if (provider) {
    givenWeb3 = null
    givenWeb3 = new Web3(provider)
    return givenWeb3
  }

  if (givenWeb3) return givenWeb3
}

export default givenWeb3
