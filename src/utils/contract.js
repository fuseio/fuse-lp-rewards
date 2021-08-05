import { Pair as PairABI, Erc20 as Erc20ABI } from '@/constants/abi'
import { formatWeiToNumber } from '@/utils/format'

async function fetchTokenInfo (tokenAddress, web3) {
  const erc20ContractInstance = new web3.eth.Contract(Erc20ABI, tokenAddress)
  const symbol = await erc20ContractInstance.methods.symbol().call()

  return {
    address: tokenAddress,
    symbol
  }
}

export async function fetchPairContractData (tokenAddress, web3) {
  const pairContractInstance = new web3.eth.Contract(PairABI, tokenAddress)

  const totalSupplyWei = await pairContractInstance.methods.totalSupply().call()
  const totalSupply = formatWeiToNumber(totalSupplyWei)

  const {
    _reserve0: reserve0Wei,
    _reserve1: reserve1Wei
  } = await pairContractInstance.methods.getReserves().call()
  const reserve0 = formatWeiToNumber(reserve0Wei)
  const reserve1 = formatWeiToNumber(reserve1Wei)

  const token0Address = await pairContractInstance.methods.token0().call()
  const token1Address = await pairContractInstance.methods.token1().call()
  const token0 = await fetchTokenInfo(token0Address, web3)
  const token1 = await fetchTokenInfo(token1Address, web3)

  return {
    totalSupply,
    reserve0,
    reserve1,
    token0,
    token1
  }
}
