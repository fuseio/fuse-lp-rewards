import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import map from 'lodash/map'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'
import reverse from 'lodash/reverse'
import get from 'lodash/get'
import classNames from 'classnames'
import RewardCard from '@/components/common/RewardCard'
<<<<<<< HEAD
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
import ethIcon from '@/assets/images/eth.svg'
import fuseIcon from '@/assets/images/fuse-token.svg'

const pairsIcons = {
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
  'G$/USDC': gooddollarUsdcIcon
}

const filters = ['All', 'New', 'Expired']

const stakingContracts = [
  {
    icon: ethIcon,
    network: 'Ethereum',
    items: CONFIG.contracts.main
  },
  {
    icon: fuseIcon,
    network: 'Fuse',
    items: CONFIG.contracts.fuse
  }
]
=======
import { selectStakingPlatform } from '@/actions/staking'
import { PAIRS_ICONS, STAKING_CONTRACTS, REWARDS_PLATFORMS_LIST } from '@/constants'
>>>>>>> added initial rewardsV2

export default () => {
  const disptach = useDispatch()
  const { stakingPlatform } = useSelector(state => state.screens.home)

  const selectPlatform = (platform) => {
    disptach(selectStakingPlatform(platform))
  }

  const contracts = STAKING_CONTRACTS.filter(contract => contract.platform === stakingPlatform)

  return (
    <div className='rewards__wrapper'>
      <div className='rewards'>
        <div className='rewards__headline'>
          <h1>Fuse LP rewards</h1>
          <p>Please choose your preferred pair, provide liquidity on Uniswap (Ethereum) or Fuseswap (Fuse) then deposit your LP tokens and start earning Fuse.</p>
        </div>
        <div className="rewards__platforms">
          {REWARDS_PLATFORMS_LIST.map(platform => (
            <button 
              className={classNames('rewards__platform', { 'rewards__platform--active': stakingPlatform === platform.name })} 
              onClick={() => selectPlatform(platform.name)}
            >
              <div className="rewards__platform__header">
                <img className="rewards__platform__banner" src={platform.banner} />
                <img className="rewards__platform__icon" src={platform.icon} />
              </div>
              <div className="rewards__platform__footer">
                {platform.label}
              </div>
            </button>
          ))}
        </div>
        <div className='rewards__section'>
          <div className='rewards__section__title'>
            <h3 className='rewards__section__label'>{stakingPlatform}</h3>
          </div>
        </div>
        {
          !isEmpty(contracts) ? contracts.map(({ icon, network, items }, index) => (
            <div className='rewards__cards-container grid-x align-middle'>
              {
                reverse(map(items, (contract) => {
                  const { contractAddress } = contract
                  return (
                    <RewardCard 
                      className={`reward-card--${stakingPlatform.toLowerCase()}`} 
                      icon={PAIRS_ICONS[contract.pairName]} 
                      key={contractAddress} 
                      {...contract} 
                      stakingContract={contractAddress} 
                    />
                  )
                }))
              }
            </div>
          )) : (<div>Coming Soon</div>)
        }
      </div>
    </div>
  )
}
