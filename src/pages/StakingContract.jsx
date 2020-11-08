import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { BigNumber } from 'bignumber.js'
import InfoBox from '@/components/common/InfoBox.jsx'
import Tabs from '@/components/Tabs'
import briefcaseIcongray from '@/assets/images/briefcase-check-gray.svg'
import briefcaseIcon from '@/assets/images/briefcase-check.svg'
import walletIcon from '@/assets/images/wallet-plus.svg'
import walletIcongray from '@/assets/images/wallet-plus-gray.svg'
import percentageIcon from '@/assets/images/percentage.svg'
import percentageIcongray from '@/assets/images/percentage-gray.svg'
import { formatWeiToNumber } from '@/utils/format'
import useInterval from '@/hooks/useInterval'
import { getStakerData, getStatsData, getTokenAllowance, getStakingPeriod } from '@/actions/staking'
import ChooseStakingContract from '@/pages/ChooseStakingContract.jsx'

export default ({ handleConnect }) => {
  const dispatch = useDispatch()
  const { withdrawnToDate = 0, accruedRewards = 0, totalStaked = 0, apyPercent = 0, stakingContract } = useSelector(state => state.staking)
  const { accountAddress } = useSelector(state => state.network)
  const [isRunning, setIsRunning] = useState(!!accountAddress)
  const accrued = new BigNumber(withdrawnToDate).plus(new BigNumber(accruedRewards))

  useEffect(() => {
    if (accountAddress && stakingContract) {
      dispatch(getTokenAllowance())
      dispatch(getStakerData())
      dispatch(getStatsData())
      dispatch(getStakingPeriod())
    }
  }, [accountAddress, stakingContract])

  useEffect(() => {
    if (accountAddress) {
      setIsRunning(true)
    }
  }, [accountAddress])

  useInterval(() => {
    dispatch(getStatsData())
  }, isRunning ? 5000 : null)

  if (!stakingContract) {
    return <ChooseStakingContract />
  }

  return (
    <div className='main__wrapper'>
      <div className='main'>
        <h1 className='title'>Add liquidity</h1>
        <div className='boxs'>
          <InfoBox
            name='apy'
            modalText='APY - Annual Percentage Yield (APY) is the estimated yearly yield for tokens locked. Our calculation is " $ locked * (1 year in second)/(total stake in $ * time remaining in seconds).'
            withSymbol={false}
            end={parseInt(apyPercent)}
            title='Deposit APY'
            Icon={() => (
              <img src={accountAddress ? percentageIcon : percentageIcongray} />
            )}
          />
          <InfoBox
            link='https://app.uniswap.org/#/add/0x970B9bB2C0444F5E81e9d0eFb84C8ccdcdcAf84d/ETH'
            name='deposits'
            symbol='FUSE-ETH'
            modalText='Your Deposits - Your deposits shows the total amount of FUSE you have deposited into the Staking Contract.'
            title='Your deposits'
            end={formatWeiToNumber(totalStaked)}
            Icon={() => (
              <img src={accountAddress ? briefcaseIcon : briefcaseIcongray} />
            )}
          />
          <InfoBox
            link='https://etherscan.io/token/0x970B9bB2C0444F5E81e9d0eFb84C8ccdcdcAf84d'
            name='rewards'
            symbol='FUSE'
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
  )
}
