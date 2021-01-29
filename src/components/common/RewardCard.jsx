import React, { useEffect, useMemo } from 'react'
import ReactGA from 'react-ga'
import { useCountUp } from 'react-countup'
import moment from 'moment'
import Countdown from 'react-countdown'
import get from 'lodash/get'
import fireLabel from '@/assets/images/fire.svg'
import calendar from '@/assets/images/calendar.svg'
import hourglass from '@/assets/images/hourglass-solid.svg'
import { useDispatch, useSelector } from 'react-redux'
import { push } from 'connected-react-router'
import { selectStakingContract } from '@/actions/staking'
import { formatWeiToNumber, formatNumber } from '@/utils/format'

export default ({ icon, pairName, stakingContract, totalReward, isHot, LPToken, networkId, pairs, uniPairToken, btnText = 'Select' }) => {
  const dispatch = useDispatch()
  const stakingContracts = useSelector(state => state.entities.stakingContracts)
  const { start: globalTotalStakeStarter, update: globalTotalStakeUpdate } = useCountUp({
    formattingFn: formatNumber,
    end: 0
  })

  const { countUp: totalRewardCounter, start: totalRewardStarter, update: totalRewardUpdate } = useCountUp({
    formattingFn: formatNumber,
    end: 0
  })

  const { countUp: reserve0Counter, start: reserve0dStarter, update: reserve0Update } = useCountUp({
    formattingFn: formatNumber,
    end: 0,
    decimals: 2
  })

  const { countUp: reserve1Counter, start: reserve1dStarter, update: reserve1Update } = useCountUp({
    formattingFn: formatNumber,
    end: 0,
    decimals: 2
  })

  useEffect(() => {
    globalTotalStakeStarter()
    totalRewardStarter()
    reserve1dStarter()
    reserve0dStarter()
  }, [])

  useEffect(() => {
    reserve0Update(formatWeiToNumber(get(stakingContracts, [stakingContract, 'reserve0'], 0)))
  }, [get(stakingContracts, [stakingContract, 'reserve0'], 0)])

  useEffect(() => {
    reserve1Update(formatWeiToNumber(get(stakingContracts, [stakingContract, 'reserve1'], 0)))
  }, [get(stakingContracts, [stakingContract, 'reserve1'], 0)])

  useEffect(() => {
    globalTotalStakeUpdate(networkId === 1
      ? formatWeiToNumber(get(stakingContracts, [stakingContract, 'globalTotalStake'], 0))
      : formatWeiToNumber(get(stakingContracts, [stakingContract, 'accruedRewards'], 0)))
  }, [networkId === 1
    ? formatWeiToNumber(get(stakingContracts, [stakingContract, 'globalTotalStake'], 0))
    : formatWeiToNumber(get(stakingContracts, [stakingContract, 'accruedRewards'], 0))])

  useEffect(() => {
    totalRewardUpdate(totalReward || formatWeiToNumber(get(stakingContracts, [stakingContract, 'totalReward'], 0)))
  }, [get(stakingContracts, [stakingContract, 'totalReward'], 0)])

  const dateEnd = useMemo(() => {
    const stakingStartTime = Number(get(stakingContracts, [stakingContract, 'stakingStartTime'], 0))
    const stakingPeriod = Number(get(stakingContracts, [stakingContract, 'stakingPeriod'], 0))
    const end = moment.unix(stakingStartTime + stakingPeriod).diff(moment())
    const dateEnd = Date.now() + end
    return dateEnd
  }, [get(stakingContracts, [stakingContract, 'stakingStartTime'], 0), get(stakingContracts, [stakingContract, 'stakingPeriod'], 0)])

  const dateStart = useMemo(() => {
    const stakingStartTime = Number(get(stakingContracts, [stakingContract, 'stakingStartTime'], 0))
    return moment.unix(stakingStartTime)
  }, [get(stakingContracts, [stakingContract, 'stakingStartTime'], 0)])

  const handleClick = () => {
    ReactGA.event({
      category: 'action',
      action: 'Action - Select staking contract',
      label: `Selected ${stakingContract}`
    })
    dispatch(selectStakingContract({ stakingContract, lpToken: LPToken, networkId, pairName, uniPairToken, pairs }))
    dispatch(push('/staking-contract'))
  }

  const isExpired = get(stakingContracts, [stakingContract, 'isExpired'], false)
  const isComingSoon = get(stakingContracts, [stakingContract, 'isComingSoon'], false)
  const token0 = get(stakingContracts, [stakingContract, 'token0'], {})
  const token1 = get(stakingContracts, [stakingContract, 'token1'], {})

  return (
    <div className='reward-card cell medium-10 small-24'>
      <div className='reward-card__icons'>
        <img src={icon} className='reward-card__icon' />
        {!isComingSoon && isHot && <div className='icon icon--new'><img src={fireLabel} /><span>New</span> </div>}
        {isExpired && <div className='icon icon--expired'><span>Expired</span></div>}
        {isComingSoon && <div className='icon icon--soon'><img src={hourglass} /><span>Soon</span></div>}
      </div>
      <h1 className='reward-card__title'>{pairName}</h1>
      <div className='card-section'>
        <div className='card-calender__label'>
          <img className='card-calender__icon' src={calendar} />
          <h1 className='card-section__label'>{!isComingSoon ? 'Expiration date' : 'Start date'}</h1>
        </div>
        {
          !isComingSoon
            ? dateEnd
                ? <div className='card-section-info'><Countdown date={dateEnd} /></div>
                : 0
            : dateStart
              ? <div className='card-section-info'><Countdown date={dateStart} /></div>
              : 0
        }
      </div>
      <div className='card-section'>
        <h1 className='card-section__label'>Pool Size</h1>
        <h1 className='card-section__info'>{reserve1Counter} {token1.symbol} / {reserve0Counter} {token0.symbol}</h1>
      </div>
      <div className='card-section'>
        <h1 className='card-section__label'>TOTAL REWARDS</h1>
        <h1 className='card-section__info'>{totalRewardCounter} FUSE</h1>
      </div>
      <button className='button' disabled={isComingSoon} onClick={handleClick}>{btnText}</button>
    </div>
  )
}
