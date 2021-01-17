import React, { useState } from 'react'
import map from 'lodash/map'
import RewardCard from '@/components/common/RewardCard'
import ethFuseIcon from '@/assets/images/coins-pair-eth-fuse.svg'
import wethUsdcIcon from '@/assets/images/coins-pair-weth-usdc.svg'
import wbtcWethIcon from '@/assets/images/coins-pair-wbtc-weth.svg'
import daiUSDTIcon from '@/assets/images/coins-pair-dai-usdt.svg'
import usdcUsdtIcon from '@/assets/images/coins-pair-usdc-usdt.svg'
import ethIcon from '@/assets/images/eth.svg'
import fuseIcon from '@/assets/images/fuse-token.svg'

const pairsIcons = {
  'ETH/FUSE': ethFuseIcon,
  'WETH/USDC': wethUsdcIcon,
  'WBTC/WETH': wbtcWethIcon,
  'USDC/USDT': usdcUsdtIcon,
  'DAI/USDT': daiUSDTIcon
}



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

export default () => {
  const handleClick = (e) => {
    console.log(e.target.name);
    setFilter(e.target.name);
  }
  const [filter, setFilter] = useState('all');
  return (
    <div className='rewards__wrapper'>
      <div className='rewards'>
        <div className='rewards__headline'>
          <h1>Fuse LP rewards</h1>
          <p>Please choose your preferred pair, provide liquidity on Uniswap (Ethereum) or Fuseswap (Fuse) then deposit your LP tokens and start earning Fuse.</p>
        </div>
        <div className='rewards__filter-chips'>
          <button className='chip' disabled={filter == "all"} name="all" onClick={handleClick}>All </button>
          <button className='chip' disabled={filter == "hot"} name="hot" onClick={handleClick}>New </button>
          <button className='chip' disabled={filter == "expired"} name="expired" onClick={handleClick}>Expired </button>
        </div>
        {
          stakingContracts.map(({ icon, network, items }, index) => (
            <div className='rewards__section' key={index}>
              <div className='rewards__section__title'>
                <img className='rewards__section__icon' src={icon} />
                <h3 className='rewards__section__label'>Rewards on {network}</h3>
              </div>
              <div className='rewards__cards-container grid-x align-middle'>
                {
                  (filter == "all") && map(items, (contract, address) => !contract.isExpired && <RewardCard icon={pairsIcons[contract.pairName]} key={address} {...contract} stakingContract={address} />)
                }
                {
                  (filter != "hot") && map(items, (contract, address) => contract.isExpired && <RewardCard icon={pairsIcons[contract.pairName]} key={address} {...contract} stakingContract={address} />)
                }
                {
                  (filter == "hot") && map(items, (contract, address) => contract.isHot && <RewardCard icon={pairsIcons[contract.pairName]} key={address} {...contract} stakingContract={address} />)
                }
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
