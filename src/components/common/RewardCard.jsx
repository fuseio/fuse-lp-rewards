import React, { useEffect, useMemo } from 'react'
import { useCountUp } from 'react-countup'
import moment from 'moment'
import Countdown from 'react-countdown'
import get from 'lodash/get'
import hotLabel from '@/assets/images/hot-label.svg'
import calendar from '@/assets/images/calendar.svg'
import { useDispatch, useSelector } from 'react-redux'
import { push } from 'connected-react-router'
import { selectStakingContract } from '@/actions/staking'
import { formatWeiToNumber, formatNumber } from '@/utils/format'

export default ({ icon, pairName, stakingContract, isExpired, btnText, isHot, LPToken, networkId }) => {
  const dispatch = useDispatch()
  const stakingContracts = useSelector(state => state.entities.stakingContracts)

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
    globalTotalStakeUpdate(formatWeiToNumber(get(stakingContracts, [stakingContract, 'globalTotalStake'], 0)))
  }, [get(stakingContracts, [stakingContract, 'globalTotalStake'], 0)])

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
    dispatch(selectStakingContract({ stakingContract, lpToken: LPToken, networkId, pairName }))
    dispatch(push('/staking-contract'))
  }

  return (
    <div className='reward-card cell medium-10 small-24'>
      <div className='reward-card__icons'>
        <img src={icon} className='reward-card__icon' />
        {isHot && <img src={hotLabel} />}
        {isExpired && <span>Expired</span>}
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
        <h1 className='card-section__label'>TOTAL DEPOSITS</h1>
        <h1 className='card-section__info'>{globalTotalStakeCounter}</h1>
      </div>
      <div className='card-section'>
        <h1 className='card-section__label'>TOTAL REWARDS</h1>
        <h1 className='card-section__info'>{totalRewardCounter}</h1>
      </div>
      {/* <div className='card-section'>
        <h1 className='card-section__label'>APY</h1>
        <h1 className='card-section__apy'>{apy}</h1>
      </div> */}
      <button className='button' disabled={btnText?.includes('soon')} onClick={handleClick}>{btnText || 'Submit'}</button>
    </div>
  )
}
