import React from 'react'
import classNames from 'classnames'
import InfoIcon from '@/components/common/InfoIcon.jsx'

export default ({ Icon, name, title, value = 0 }) => {
  return (
    <div className={classNames('info_box', { [`info_box--${name}`]: name })}>
      <div className='icons'>
        <Icon />
        <InfoIcon fill='#7E8AB4' />
      </div>
      <div>
        <div className='info_box__value'>{value}</div>
        <div className='info_box__title'>{title}</div>
      </div>
    </div>
  )
}
