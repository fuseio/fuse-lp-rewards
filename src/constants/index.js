import ethIcon from '@/assets/images/eth.svg'
import fuseIcon from '@/assets/images/fuse-token.svg'
import uniswapBanner from '@/assets/images/uniswap.png'
import bscIcon from '@/assets/images/bsc-icon.png'
import balanacerBanner from '@/assets/images/balancer.png'
import pancakeSwapBanner from '@/assets/images/pancake-swap.png'
import comingSoonBanner from '@/assets/images/comingSoonBanner.png'
import comingSoonIcon from '@/assets/images/comingSoonIcon.png'
import fuseSwapBanner from '@/assets/images/fuse-swap.png'
import ethFuseIcon from '@/assets/images/coins-pair-eth-fuse.svg'
import wethUsdcIcon from '@/assets/images/coins-pair-weth-usdc.svg'
import wbtcWethIcon from '@/assets/images/coins-pair-wbtc-weth.svg'
import daiUSDTIcon from '@/assets/images/coins-pair-dai-usdt.svg'
import usdcUsdtIcon from '@/assets/images/coins-pair-usdc-usdt.svg'
import usdcFuseIcon from '@/assets/images/coins-pair-usdc-fuse.svg'
import kncusdc from '@/assets/images/coins-pair-knc-usdc.svg'
import omusdc from '@/assets/images/coins-pair-om-usdc.svg'
import linkWethIcon from '@/assets/images/coins-pair-link-weth.svg'
import grtWethIcon from '@/assets/images/coins-pair-grt-weth.svg'
import gooddollarUsdcIcon from '@/assets/images/coins-pair-gooddollar-usdc.svg'
import fuseFuseDollarIcon from '@/assets/images/coins-pair-fuse-fUSD.svg'
import fuseBnbIcon from '@/assets/images/coins-pair-fuse-bnb.svg'
import fusdBnbIcon from '@/assets/images/coins-pair-fusd-bnb.svg'
import dextFuseIcon from '@/assets/images/dext-fuse.svg'

export const PAIRS_ICONS = {
  'ETH/FUSE': ethFuseIcon,
  'WETH/USDC': wethUsdcIcon,
  'WBTC/WETH': wbtcWethIcon,
  'USDC/USDT': usdcUsdtIcon,
  'DAI/USDT': daiUSDTIcon,
  'USDC/FUSE': usdcFuseIcon,
  'KNC/USDC': kncusdc,
  'OM/USDC': omusdc,
  'LINK/WETH': linkWethIcon,
  'GRT/WETH': grtWethIcon,
  'G$/USDC': gooddollarUsdcIcon,
  'fUSD/FUSE': fuseFuseDollarIcon,
  'FUSE/BNB': fuseBnbIcon,
  'WETH/FUSE': ethFuseIcon,
  'fUSD/BNB': fusdBnbIcon,
  'DEXT/FUSE': dextFuseIcon
}

export const REWARDS_PLATFORMS = {
  UNISWAP: 'Uniswap',
  FUSESWAP: 'FuseSwap',
  PANCAKESWAP: 'PancakeSwap',
  BALANCER: 'ComingSoon2',
  FEGEX: 'FEGex'
}

export const REWARDS_PLATFORMS_LIST = [
  {
    name: REWARDS_PLATFORMS.UNISWAP,
    label: 'Uniswap On Ethereum',
    banner: uniswapBanner,
    icon: ethIcon
  },
  {
    name: REWARDS_PLATFORMS.FUSESWAP,
    label: 'FuseSwap On Fuse',
    banner: fuseSwapBanner,
    icon: fuseIcon
  },
  {
    name: REWARDS_PLATFORMS.PANCAKESWAP,
    label: 'PancakeSwap On BSC ',
    banner: pancakeSwapBanner,
    icon: bscIcon
  },
  {
    name: REWARDS_PLATFORMS.FEGEX,
    label: 'FEGex on BSC',
    banner: comingSoonBanner,
    icon: bscIcon
  }
]

export const STAKING_CONTRACTS = [
  {
    icon: ethIcon,
    network: 'Ethereum',
    platform: REWARDS_PLATFORMS.UNISWAP,
    items: CONFIG.contracts.main
  },
  {
    icon: fuseIcon,
    network: 'Fuse',
    platform: REWARDS_PLATFORMS.FUSESWAP,
    items: CONFIG.contracts.fuse
  },
  {
    icon: bscIcon,
    network: 'Bsc',
    platform: REWARDS_PLATFORMS.PANCAKESWAP,
    items: CONFIG.contracts.bsc.pancake
  },
  {
    icon: bscIcon,
    network: 'Bsc',
    platform: REWARDS_PLATFORMS.FEGEX,
    items: CONFIG.contracts.bsc.fegex
  }
]

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

export const BNB_COIN_ID = 'binancecoin'

export const COINGECKO_ID_MAP = {
  '0x5857c96DaE9cF8511B08Cb07f85753C472D36Ea3': CONFIG.rewardTokens['1'],
  '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c': BNB_COIN_ID,
  '0x2170Ed0880ac9A755fd29B2688956BD959F933F8': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
}

export const DEPOSIT_BLACKLIST = ['0xC68eAa3c93cA8BB829243EA2cdA215c944500b2a']
