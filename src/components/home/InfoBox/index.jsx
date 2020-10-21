import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import InfoIcon from '@/components/common/InfoIcon.jsx'
import InfoIconHover from '@/components/common/InfoIconHover.jsx'
import { useCountUp } from 'react-countup'
import { formatNumber } from '@/utils/format'

export default ({ Icon, name, title, end, withSymbol = true }) => {
  const { accountAddress } = useSelector(state => state.network)
  const [isHover, setHover] = useState(false)
  const { countUp, start, update } = useCountUp({
    formattingFn: formatNumber,
    end
  })

  useEffect(() => {
    start()
  }, [])

  useEffect(() => {
    update(end)
  }, [end])

  return (
    <div className={classNames('info_box', { [`info_box--${name}`]: name && accountAddress }, { 'info_box--disabled': !accountAddress })}>
      <div className='icons'>
        <Icon />
        <div
          className='item'
          onMouseEnter={() => {
            setHover(true)
          }}
          onMouseLeave={() => {
            setHover(false)
          }}
        >
          {isHover && accountAddress ? <InfoIconHover fill='#7E8AB4' /> : <InfoIcon fill={accountAddress ? '#7E8AB4' : '#B2BCC4'} />}
        </div>
      </div>
      <div>
        {
          withSymbol
            ? <div className={classNames('info_box__value', { 'info_box__value--disabled': !accountAddress })}>{countUp} FUSE</div>
            : <div className={classNames('info_box__value', { 'info_box__value--disabled': !accountAddress })}>{countUp}</div>
        }
        <div className={classNames('info_box__title', { 'info_box__title--disabled': !accountAddress })}>{title}</div>
      </div>
    </div>
  )
}
