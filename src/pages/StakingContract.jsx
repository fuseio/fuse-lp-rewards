import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Redirect, useParams } from 'react-router'
import { BigNumber } from 'bignumber.js'
import get from 'lodash/get'
import InfoBox from '@/components/common/InfoBox.jsx'
import Tabs from '@/components/Tabs'
import briefcaseIcongray from '@/assets/images/briefcase-check-gray.svg'
import briefcaseIcon from '@/assets/images/briefcase-check.svg'
import walletIcon from '@/assets/images/wallet-plus.svg'
import walletIcongray from '@/assets/images/wallet-plus-gray.svg'
import percentageIcon from '@/assets/images/percentage.svg'
import percentageIcongray from '@/assets/images/percentage-gray.svg'
import { formatWeiToNumber, symbolFromPair } from '@/utils/format'
import { getBlockExplorerUrl, networkIds } from '@/utils/network'
import useInterval from '@/hooks/useInterval'
import { getStatsData } from '@/actions/staking'
import SwitchNetwork from '@/components/common/SwitchNetwork'
import useSwitchNetwork from '../hooks/useSwitchNetwork'
import { getRewardTokenName } from '@/utils'

export default ({ handleConnect }) => {
  const dispatch = useDispatch()
  const { stakingContract, pairName, lpToken, networkId } = useSelector(state => state.staking)
  const switchNetwork = useSwitchNetwork()
  const stakingContracts = useSelector(state => state.entities.stakingContracts)
  const { accountAddress, providerInfo } = useSelector(state => state.network)
  const [isRunning, setIsRunning] = useState(!!accountAddress)

  const accruedRewards = get(stakingContracts, [stakingContract, 'accruedRewards'], 0)
  const withdrawnToDate = get(stakingContracts, [stakingContract, 'withdrawnToDate'], 0)
  const apyPercent = get(stakingContracts, [stakingContract, 'apyPercent'], 0)
  const accrued = new BigNumber(withdrawnToDate).plus(new BigNumber(accruedRewards))
  const totalStaked = get(stakingContracts, [stakingContract, 'totalStaked'], 0)
  const isExpired = get(stakingContracts, [stakingContract, 'isExpired'])
  const symbol = symbolFromPair(pairName)
  const isSwitchNetworkSupported = 
    get(providerInfo, 'id') === 'injected' && 
    get(providerInfo, 'name') === 'MetaMask' &&  
    networkId !== networkIds.MAINNET 
    

  if (!stakingContract) {
    return <Redirect to='/' />
  }

  useEffect(() => {
    if (accountAddress) {
      if (isSwitchNetworkSupported) switchNetwork(networkId)
      setIsRunning(true)
    }
  }, [accountAddress, isSwitchNetworkSupported])

  useInterval(() => {
    // get contract stats
    dispatch(getStatsData(stakingContract, lpToken, networkId))
  }, isRunning ? 5000 : null)

  return (
    <>
      {!isSwitchNetworkSupported && <SwitchNetwork networkId={networkId} />}
      <div className='main__wrapper'>
        <div className='main'>
          <h1 className='title'>Add liquidity</h1>
          <div className='boxs'>
            <InfoBox
              name='apy'
              modalText='APY - Annual Percentage Yield (APY) is the estimated yearly yield for tokens locked. Our calculation is " $ locked * (1 year in second)/(total stake in $ * time remaining in seconds).'
              withSymbol={false}
              end={!isExpired ? parseInt(apyPercent) : 0}
              title='Deposit APY'
              Icon={() => (
                <img src={accountAddress ? percentageIcon : percentageIcongray} />
              )}
            />
            <InfoBox
              name='deposits'
              symbol={symbol}
              modalText='Your Deposits - Your deposits shows the total amount of FUSE you have deposited into the Staking Contract.'
              decimals={8}
              title='Your deposits'
              end={formatWeiToNumber(totalStaked)}
              Icon={() => (
                <img src={accountAddress ? briefcaseIcon : briefcaseIcongray} />
              )}
              format={false}
            />
            <InfoBox
              link={`${getBlockExplorerUrl(networkId)}/address/${CONFIG.rewardTokens[networkId]}`}
              name='rewards'
              symbol={getRewardTokenName(networkId)}
              modalText={"Accrued Rewards - Accrued Rewards refers to the total FUSE you've earned for your stake"}
              end={formatWeiToNumber(accrued)}
              title='Accrued rewards'
              Icon={() => (
                <img src={accountAddress ? walletIcon : walletIcongray} />
              )}
            />
          </div>
          <Tabs handleConnect={handleConnect} />
        </div>
      </div>
    </>
  )
}
