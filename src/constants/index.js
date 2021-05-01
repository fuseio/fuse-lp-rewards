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
import fuseFuseDollarIcon from '@/assets/images/fuse-fusedollar.png'

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
  'fUSD/FUSE': fuseFuseDollarIcon
}

export const REWARDS_PLATFORMS = {
  UNISWAP: 'Uniswap',
  FUSESWAP: 'FuseSwap',
  PANCAKESWAP: 'ComingSoon1',
  BALANCER: 'ComingSoon2'
}

export const REWARDS_PLATFORMS_LIST = [
  {
    name: REWARDS_PLATFORMS.UNISWAP,
		label: 'Uniswap On Ethereum',
		banner: uniswapBanner,
		icon: ethIcon,
  },
	{
		name: REWARDS_PLATFORMS.FUSESWAP,
		label: 'FuseSwap On Fuse',
		banner: fuseSwapBanner,
		icon: fuseIcon
	},
	{
		name: REWARDS_PLATFORMS.PANCAKESWAP,
		label: 'Coming soon!',
		banner: comingSoonBanner,
		icon: comingSoonIcon
	},
	{
		name: REWARDS_PLATFORMS.BALANCER,
		label: 'Coming soon!',
		banner: comingSoonBanner,
		icon: comingSoonIcon
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
  }
]

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
