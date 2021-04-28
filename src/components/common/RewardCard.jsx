import React from 'react'
import ReactGA from 'react-ga'
import Countdown from 'react-countdown'
import get from 'lodash/get'
import { useDispatch, useSelector } from 'react-redux'
import { push } from 'connected-react-router'
import classNames from 'classnames'
import { selectStakingContract } from '@/actions/staking'
import { formatWeiToNumber } from '@/utils/format'
import useStartDate from '@/hooks/useStartDate'
import useEndDate from '@/hooks/useEndDate'
import useCounter from '@/hooks/useCounter'
import trophy from '@/assets/images/trophy.svg'

export default ({ 
  className, 
  icon, 
  pairName, 
  stakingContract, 
  totalReward: defaultTotalReward, 
  LPToken, 
  networkId, 
  pairs, 
  uniPairToken, 
  btnText = 'Select' 
}) => {
  const dispatch = useDispatch()
  const stakingContracts = useSelector(state => state.entities.stakingContracts)

  const isExpired = get(stakingContracts, [stakingContract, 'isExpired'], false)
  const isComingSoon = get(stakingContracts, [stakingContract, 'isComingSoon'], false)
  const token0 = get(stakingContracts, [stakingContract, 'token0'], {})
  const token1 = get(stakingContracts, [stakingContract, 'token1'], {})
  const reserve0 = get(stakingContracts, [stakingContract, 'reserve0'], 0)
  const reserve1 = get(stakingContracts, [stakingContract, 'reserve1'], 0)
  const apyPercent = get(stakingContracts, [stakingContract, 'apyPercent'], 0)
  const totalReward = get(stakingContracts, [stakingContract, 'totalReward'])
  const stakingStartTime = get(stakingContracts, [stakingContract, 'stakingStartTime'], 0)
  const stakingPeriod = get(stakingContracts, [stakingContract, 'stakingPeriod'], 0)

  const reserve0Counter = useCounter(formatWeiToNumber(reserve0), 2)
  const reserve1Counter = useCounter(formatWeiToNumber(reserve1), 2)
  const totalRewardCounter = useCounter(defaultTotalReward || formatWeiToNumber(totalReward))
  const apyPercentCounter = useCounter(apyPercent)

  const dateEnd = useEndDate(stakingStartTime, stakingPeriod)
  const dateStart = useStartDate(stakingStartTime)

  const isNew = !isComingSoon && !isExpired 

  const handleClick = () => {
    ReactGA.event({
      category: 'action',
      action: 'Action - Select staking contract',
      label: `Selected ${stakingContract}`
    })
    dispatch(selectStakingContract({ stakingContract, lpToken: LPToken, networkId, pairName, uniPairToken, pairs }))
    dispatch(push(`/staking-contract`))
  }

  return (
    <div className={classNames('reward-card cell medium-10 small-24', className)}>
      <div className="reward-card__header">
        <div className="reward-card__badge">
          <img src={trophy} /> APY : {apyPercentCounter === 'Infinity' || isExpired ? 0 : apyPercentCounter}%
        </div>
        <div className={classNames('reward-status', {
          'reward-status--soon': isComingSoon, 
          'reward-status--expired': isExpired, 
          'reward-status--new': isNew
        })} />
      </div>
      <div className='reward-card__icons'>
        <img src={icon} className='reward-card__icon' />
        <h1 className='reward-card__title'>{pairName}</h1>
      </div>
      <div className='card-section'>
        <div className='card-calender__label'>
          <h1 className='card-section__label'>{!isComingSoon ? 'Expiration date' : 'Start date'}</h1>
        </div>
        {
          !isComingSoon
            ? dateEnd
                ? <div className='card-section__info'><Countdown date={dateEnd} /></div>
                : 0
            : dateStart
              ? <div className='card-section__info'><Countdown date={dateStart} /></div>
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
      <button 
        className={classNames('button', { 'button--grey': isExpired })} 
        disabled={isComingSoon} 
        onClick={handleClick}
      >
        {(isNew || isComingSoon) && 'Deposit'}
        {isExpired && 'Withdraw'}
      </button>
    </div>
  )
}
