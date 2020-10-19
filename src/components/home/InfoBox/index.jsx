import React from 'react'
import classNames from 'classnames'
import InfoIcon from '@/components/common/InfoIcon.jsx'
import percentageIcon from '@/assets/images/percentage.svg'

export default ({ name }) => {
  return (
    <div className={classNames('info_box', { [`info_box--${name}`]: name })}>
      <div className='icons'>
        <img src={percentageIcon} />
        <InfoIcon fill='#7E8AB4' />
      </div>
      <div>
        <div className='info_box__value'>3.89%</div>
        <div className='info_box__title'>Deposit APY</div>
      </div>
    </div>
  )
}
