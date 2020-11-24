import React, { useEffect, useMemo } from 'react'
import ReactGA from 'react-ga'
import { useCountUp } from 'react-countup'
import moment from 'moment'
import Countdown from 'react-countdown'
import get from 'lodash/get'
import fireLabel from '@/assets/images/fire.svg'
import calendar from '@/assets/images/calendar.svg'
import { useDispatch, useSelector } from 'react-redux'
import { push } from 'connected-react-router'
import { selectStakingContract } from '@/actions/staking'
import { formatWeiToNumber, formatNumber, symbolFromPair } from '@/utils/format'

export default ({ icon, pairName, stakingContract, isExpired, isHot, LPToken, networkId, pairs, uniPairToken, btnText = 'Select' }) => {
  const dispatch = useDispatch()
  const stakingContracts = useSelector(state => state.entities.stakingContracts)
  const symbol = symbolFromPair(pairName)

  const { countUp: globalTotalStakeCounter, start: globalTotalStakeStarter, update: globalTotalStakeUpdate } = useCountUp({
    formattingFn: formatNumber,
    end: 0
  })

  const { countUp: totalRewardCounter, start: totalRewardStarter, update: totalRewardUpdate } = useCountUp({
    formattingFn: formatNumber,
    end: 0
  })

  useEffect(() => {
    globalTotalStakeStarter()
    totalRewardStarter()
  }, [])

  useEffect(() => {
    globalTotalStakeUpdate(networkId === 1
      ? formatWeiToNumber(get(stakingContracts, [stakingContract, 'globalTotalStake'], 0))
      : formatWeiToNumber(get(stakingContracts, [stakingContract, 'accruedRewards'], 0)))
  }, [networkId === 1
    ? formatWeiToNumber(get(stakingContracts, [stakingContract, 'globalTotalStake'], 0))
    : formatWeiToNumber(get(stakingContracts, [stakingContract, 'accruedRewards'], 0))])

  useEffect(() => {
    totalRewardUpdate(formatWeiToNumber(get(stakingContracts, [stakingContract, 'totalReward'], 0)))
  }, [get(stakingContracts, [stakingContract, 'totalReward'], 0)])

  const dateEnd = useMemo(() => {
    const stakingStartTime = Number(get(stakingContracts, [stakingContract, 'stakingStartTime'], 0))
    const stakingPeriod = Number(get(stakingContracts, [stakingContract, 'stakingPeriod'], 0))
    const end = moment.unix(stakingStartTime + stakingPeriod).diff(moment())
    const dateEnd = Date.now() + end
    return dateEnd
  }, [get(stakingContracts, [stakingContract, 'stakingStartTime'], 0), get(stakingContracts, [stakingContract, 'stakingPeriod'], 0)])

  const handleClick = () => {
    ReactGA.event({
      category: 'action',
      action: 'Action - Select staking contract',
      label: `Selected ${stakingContract}`
    })
    dispatch(selectStakingContract({ stakingContract, lpToken: LPToken, networkId, pairName, uniPairToken, pairs }))
    dispatch(push('/staking-contract'))
  }

  return (
    <div className='reward-card cell medium-10 small-24'>
      <div className='reward-card__icons'>
        <img src={icon} className='reward-card__icon' />
        {isHot && <div className='icon'><img src={fireLabel} /><span>4X</span> </div>}
        {isExpired && <div className='icon'><span>Expired</span></div>}
      </div>
      <h1 className='reward-card__title'>{pairName}</h1>
      <div className='card-section'>
        <div className='card-calender__label'>
          <img className='card-calender__icon' src={calendar} />
          <h1 className='card-section__label'>Expiration date</h1>
        </div>
        {dateEnd ? <div className='card-section-info'>{<Countdown date={dateEnd} />}</div> : 0}
      </div>
      <div className='card-section'>
        <h1 className='card-section__label'>{networkId === 1 ? 'TOTAL DEPOSITS - UNI' : 'Accrued Rewards - FS'} {symbol}</h1>
        <h1 className='card-section__info'>{globalTotalStakeCounter}</h1>
      </div>
      <div className='card-section'>
        <h1 className='card-section__label'>TOTAL REWARDS</h1>
        <h1 className='card-section__info'>{totalRewardCounter} FUSE</h1>
      </div>
      <button className='button' onClick={handleClick}>{btnText}</button>
    </div>
  )
}
