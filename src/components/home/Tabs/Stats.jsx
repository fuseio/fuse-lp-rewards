import React from 'react'
import { useSelector } from 'react-redux'
// import moment from 'moment'
import { formatWeiToNumber } from '@/utils/format'
import GrayContainer from '@/components/common/GrayContainer.jsx'
// import CountdownTimer from 'react-component-countdown-timer'
// import InfoIcon from '@/components/common/InfoIcon.jsx'

const Stats = () => {
  // const stakingPeriod = '1209600', stakingStartTime = '1603465200'
  const {
    totalReward = 0,
    lockedRewards = 0,
    unlockedReward = 0,
    globalTotalStake = 0,
    // stakingStartTime = 0,
    // stakingPeriod = 0
  } = useSelector(state => state.staking)

  // const period = moment({}).seconds(stakingPeriod) // .format('MMMM Do YYYY, h:mm:ss a')
  // const startTime = moment({}).utc(stakingStartTime) // .format('MMMM Do YYYY, h:mm:ss a')
  // const diff = period.diff(startTime, 'seconds')
  // console.log({ period, diff })
  // console.log({ startTime })

  // console.log({ time: stakingPeriod + stakingStartTime })
  // console.log({ stakingStartTime })
  return (
    <div className='stats grid-x grid-margin-x grid-margin-y'>
      <div className='medium-12 small-24 cell'>
        <GrayContainer title='Total Rewards' symbol='FUSE' end={formatWeiToNumber(totalReward)} />
      </div>
      <div className='medium-12 small-24 cell'>
        <GrayContainer title='Total Deposits' symbol='UNI FUSE-ETH' end={formatWeiToNumber(globalTotalStake)} />
      </div>
      <div className='medium-12 small-24 cell'>
        <GrayContainer title='Locked Rewards' symbol='FUSE' end={formatWeiToNumber(lockedRewards)} />
      </div>
      <div className='medium-12 small-24 cell'>
        <GrayContainer title='Unlocked Rewards' symbol='FUSE' end={formatWeiToNumber(unlockedReward)} />
      </div>
      {/* <div className='medium-12 small-24 cell'>
        <div className='gray_container'>
          <div className='grid-x align-justify align-middle'>
            <div className='title'>Program Duration</div>
            <InfoIcon fill='#869AAC' />
          </div>
          <div className='grid-x align-justify align-middle'>
            <div className='value'>
              <CountdownTimer size='15' backgroundColor='#EEF3F6' count={parseInt(diff)} />
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
