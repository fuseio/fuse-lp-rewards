import BigNumber from "bignumber.js"
import request from "superagent"
import { MultiRewards as MultiRewardsABI } from '@/constants/abi'
import { Erc20 as Erc20ABI } from '@/constants/abi'
import { formatWeiToNumber } from '@/utils/format'
import { getFusePrice } from "@/services/api/coingecko"

async function fetchAllFegexTokens() {
    const response = await request('https://ticker.fegswap.com/price/v2?token=all')
    return response.body
}

async function getRewardsInfo(multiRewardAddress, account, globalTotalStakeUSD, duration, rewards, web3) {
    const rewardsInfo = []
    const mulitReward = new web3.Contract(MultiRewardsABI, multiRewardAddress)
    
    for (const reward of rewards) {
      const rewardToken = new web3.Contract(Erc20ABI, reward)

      const accuruedRewards = await mulitReward.methods.earned(account, reward).call()
      const rewardTokenDecimals = await rewardToken.methods.decimals().call()
      const totalRewards = await mulitReward.methods.getRewardForDuration(reward).call()
      const rewardData = await mulitReward.methods.rewardData(reward).call()

      const rewardRate = rewardData.rewardRate
      const rewardPrice = await getFusePrice()
      const totalRewardsInUSD = formatWeiToNumber(totalRewards, rewardTokenDecimals) * rewardPrice

      const durationInDays = duration / (3600 * 24)
      const apyPercent = (totalRewardsInUSD / globalTotalStakeUSD) * (365 / durationInDays)

      rewardsInfo.push({
        totalRewards,
        totalRewardsInUSD,
        accuruedRewards,
        apyPercent,
        rewardRate
      })
    }

    return rewardsInfo
  
}

export const getFegexStats = async (stakingAddress, pairAddress, totalStaked, duration, account, web3) => {
    const response = await fetchAllFegexTokens()

    const pairs = Object.values(response)
        .flatMap(pair => pair)
        .reduce((prev, pair) => {
            prev[pair.contract] = pair
            return prev
        }, {})

    const pair = pairs[pairAddress]

    const token0 = {
        name: pair.main_name,
        symbol: pair.main_symbol,
        decimals: pair.main_decimals
    }
    const token1 = {
        name: pair.token_name,
        symbol: pair.token_symbol,
        decimals: pair.token_decimals
    }
    const reserveUSD = pair.base_total_usd_value + pair.token_total_usd_value
    const totalReserve1 = pair.token_balance
    const totalReserve0 = pair.base_balance
    
    const multiReward = new web3.eth.Contract(MultiRewardsABI, stakingAddress)
    const pairToken = new web3.eth.Contract(Erc20ABI, pairAddress)

    const globalTotalStake = await multiReward.methods.totalSupply().call()
    const totalSupply = await pairToken.methods.totalSupply().call()
    
    const pairPrice = reserveUSD / formatWeiToNumber(totalSupply)
    const globalTotalStakeUSD = formatWeiToNumber(globalTotalStake) * pairPrice
    const totalStakedUSD = formatWeiToNumber(totalStaked) * pairPrice
    const reserve0 = new BigNumber(globalTotalStake).div(totalSupply).multipliedBy(totalReserve0)
    const reserve1 = new BigNumber(globalTotalStake).div(totalSupply).multipliedBy(totalReserve1)
    const rewardsInfo = await getRewardsInfo(
        stakingAddress,
        account,
        globalTotalStakeUSD,
        duration,
        rewards,
        web3
    )

    return {
        globalTotalStake,
        rewardsInfo,
        token0,
        token1,
        totalStakedUSD,
        globalTotalStakeUSD,
        pairPrice,
        reserve0,
        reserve1
    }
}
