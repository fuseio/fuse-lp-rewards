import React from 'react'
import Countdown from 'react-countdown'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { formatWeiToNumber } from '@/utils/format'
import GrayContainer from '@/components/common/GrayContainer.jsx'

const Stats = () => {
  const {
    totalReward = 0,
    lockedRewards = 0,
    unlockedReward = 0,
    globalTotalStake = 0,
    stakingStartTime = 0,
    stakingPeriod = 0
  } = useSelector(state => state.staking)

  const end = moment.unix(Number(stakingStartTime) + Number(stakingPeriod)).diff(moment())
  const dateEnd = Date.now() + end

  return (
    <div className='stats grid-x grid-margin-x grid-margin-y'>
      <div className='medium-12 small-24 cell'>
        <GrayContainer
          tootlipText='Total Rewards are the total $FUSE to be rewarded for the program duration.'
          title='Total Rewards'
          symbol='FUSE'
          end={formatWeiToNumber(totalReward)}
        />
      </div>
      <div className='medium-12 small-24 cell'>
        <GrayContainer
          tootlipText='Total Deposits are the total LP tokens deposited across all participants.'
          title='Total Deposits'
          symbol='UNI FUSE-ETH'
          end={formatWeiToNumber(globalTotalStake)}
        />
      </div>
      <div className='medium-12 small-24 cell'>
        <GrayContainer
          tootlipText='Locked Rewards are the $FUSE yet to be rewarded.'
          title='Locked Rewards'
          symbol='FUSE'
          end={formatWeiToNumber(lockedRewards)}
        />
      </div>
      <div className='medium-12 small-24 cell'>
        <GrayContainer
          tootlipText='Unlocked Rewards are the $FUSE rewarded to LP token depositors.'
          title='Unlocked Rewards'
          symbol='FUSE'
          end={formatWeiToNumber(unlockedReward)}
        />
      </div>
      <div className='medium-12 small-24 cell'>
        <div className='gray_container'>
          <div className='grid-x align-justify align-middle'>
            <div className='title'>Program Duration</div>
          </div>
          <div className='grid-x align-justify align-middle'>
            <div className='value'>
              <Countdown date={dateEnd} />
            </div>
          </div>
        </div>
      </div>
      {/* <div className='medium-12 small-24 cell'>
        <GrayContainer title='Reward Unlock Rate' symbol='FUSE / day' />
      </div> */}
    </div>
  )
}

export default Stats
