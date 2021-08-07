import React, { useMemo } from 'react'
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
import star from '@/assets/images/star.svg'
import useFormattedTimestamp from '@/hooks/useFormattedTimestamp'
import { getContractRewardType } from '@/utils'

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

  // card states: comingSoon -> new -> expired
  const isExpired = get(stakingContracts, [stakingContract, 'isExpired'], false)
  const isComingSoon = get(stakingContracts, [stakingContract, 'isComingSoon'], false)
  const isNew = !isComingSoon && !isExpired

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
  const formattedDateEnd = useFormattedTimestamp(dateEnd)
  const isMulti = useMemo(() => getContractRewardType(stakingContract) === 'multi', [stakingContract])

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
    <div className={classNames('reward-card cell medium-10 small-24', className)}>
      <div className='reward-card__header'>
        <div className={classNames('reward-card__badge', {
          'reward-card__badge--hide': isExpired
        }
        )}
        >
          {isComingSoon
            ? <><img src={star} /> Coming Soon</>
            : <><img src={trophy} /> APY : {apyPercentCounter}%</>}
        </div>
        <div className={classNames('reward-status', {
          'reward-status--soon': isComingSoon,
          'reward-status--expired': isExpired,
          'reward-status--new': isNew
        })}
        />
      </div>
      <div className='reward-card__icons'>
        <img src={icon} className='reward-card__icon' />
        <h1 className='reward-card__title'>{pairName}</h1>
      </div>
      <div className='card-section'>
        <div className='card-calender__label'>
          <h1 className='card-section__label'>
            {!isMulti && isComingSoon && 'Starts at'}
            {isNew && 'Expires at'}
            {!isMulti && isExpired && 'Expired at'}
          </h1>
        </div>
        {!isMulti && isComingSoon && dateStart && <div className='card-section__info'><Countdown date={dateStart} /></div>}
        {isNew && dateEnd && <div className='card-section__info'><Countdown date={dateEnd} /></div>}
        {!isMulti && isExpired && formattedDateEnd && <div className='card-section__info'>{formattedDateEnd}</div>}
      </div>
      <div className='card-section'>
        <h1 className='card-section__label'>Pool Size</h1>
        <h1 className='card-section__info'>{reserve1Counter} {token1.symbol} / {reserve0Counter.length > 6 ? (<><br />{reserve0Counter}</>) : reserve0Counter} {token0.symbol}</h1>
      </div>
      <div className='card-section'>
        <h1 className='card-section__label'>TOTAL REWARDS</h1>
        <h1 className='card-section__info'>{totalRewardCounter} FUSE</h1>
      </div>
      <button
        className={classNames('button')}
        disabled={isComingSoon}
        onClick={handleClick}
      >
        Select
      </button>
    </div>
  )
}
