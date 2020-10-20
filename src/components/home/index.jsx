import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import InfoBox from '@/components/home/InfoBox'
import Tabs from '@/components/home/Tabs'
import briefcaseIcon from '@/assets/images/briefcase-check.svg'
import walletIcon from '@/assets/images/wallet-plus.svg'
import percentageIcon from '@/assets/images/percentage.svg'
import { formatWei, formatWeiToNumber } from '@/utils/format'
import useInterval from '@/hooks/useInterval'
import { getStatsData } from '@/actions/staking'

export default () => {
  const dispatch = useDispatch()
  const { accruedRewards = 0, totalStaked = 0 } = useSelector(state => state.staking)
  const { accountAddress } = useSelector(state => state.network)
  const [isRunning, setIsRunning] = useState(!!accountAddress)

  useEffect(() => {
    if (accountAddress) {
      setIsRunning(true)
    }
  }, [accountAddress])

  useInterval(() => {
    dispatch(getStatsData())
  }, isRunning ? 5000 : null)

  return (
    <div className='main__wrapper'>
      <div className='main'>
        <h1 className='title'>Add liquidity</h1>
        <div className='boxs'>
          <InfoBox
            name='apy'
            withSymbol={false}
            title='Deposit APY'
            Icon={() => (
              <img src={percentageIcon} />
            )}
          />
          <InfoBox
            name='deposits'
            title='Your deposits'
            end={formatWeiToNumber(totalStaked)}
            value={`${formatWei(totalStaked)} FUSE`}
            Icon={() => (
              <img src={briefcaseIcon} />
            )}
          />
          <InfoBox
            name='rewards'
            end={formatWeiToNumber(accruedRewards)}
            title='Accrued rewards'
            value={`${formatWei(accruedRewards)} FUSE`}
            Icon={() => (
              <img src={walletIcon} />
            )}
          />
        </div>
        <Tabs />
      </div>
    </div>
  )
}
