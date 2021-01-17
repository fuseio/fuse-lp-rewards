import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import map from 'lodash/map'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
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

export default () => {
  const [filterValue, setFilter] = useState('all')
  const contractsData = useSelector(state => state.entities.stakingContracts)

  const handleClick = (e) => {
    setFilter(e.target.name)
  }

  return (
    <div className='rewards__wrapper'>
      <div className='rewards'>
        <div className='rewards__headline'>
          <h1>Fuse LP rewards</h1>
          <p>Please choose your preferred pair, provide liquidity on Uniswap (Ethereum) or Fuseswap (Fuse) then deposit your LP tokens and start earning Fuse.</p>
        </div>
        <div className='rewards__filter-chips'>
          {
            filters.map((fil, index) => (
              <button
                className='chip'
                disabled={filterValue === fil.toLowerCase()}
                name={fil.toLowerCase()}
                key={index}
                onClick={handleClick}
              >
                {fil}
              </button>
            ))
          }
        </div>
        {
          stakingContracts.map(({ icon, network, items }, index) => {
            const data = filterValue === 'all'
              ? items
              : (filterValue === 'new')
                ? filter(items, (o, address) => !get(contractsData, [address, 'isExpired'], false))
                : (filterValue === 'expired')
                  ? filter(items, (o, address) => get(contractsData, [address, 'isExpired'], false))
                  : []
            if (isEmpty(data)) return null
            return (
              <div className='rewards__section' key={index}>
                <div className='rewards__section__title'>
                  <img className='rewards__section__icon' src={icon} />
                  <h3 className='rewards__section__label'>Rewards on {network}</h3>
                </div>
                <div className='rewards__cards-container grid-x align-middle'>
                  {
                    map(data, (contract) => {
                      const { contractAddress } = contract
                      return <RewardCard icon={pairsIcons[contract.pairName]} key={contractAddress} {...contract} stakingContract={contractAddress} />
                    })
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
