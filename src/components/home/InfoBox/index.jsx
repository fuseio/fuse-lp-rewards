import React, { useEffect } from 'react'
import classNames from 'classnames'
import InfoIcon from '@/components/common/InfoIcon.jsx'
import { useCountUp } from 'react-countup'

const formatNumber = (num) => String(num).replace(/(.)(?=(\d{3})+$)/g, '$1,')

export default ({ Icon, name, title, value = 0, end, withSymbol = true }) => {
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
    <div className={classNames('info_box', { [`info_box--${name}`]: name })}>
      <div className='icons'>
        <Icon />
        <InfoIcon fill='#7E8AB4' />
      </div>
      <div>
        {
          withSymbol ? <div className='info_box__value'>{countUp} FUSE</div> : <div className='info_box__value'>{countUp}</div>
        }
        <div className='info_box__title'>{title}</div>
      </div>
    </div>
  )
}
