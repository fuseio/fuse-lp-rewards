import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import ReactTooltip from 'react-tooltip'
import { useSelector } from 'react-redux'
import { useCountUp } from 'react-countup'
import InfoIcon from '@/components/common/InfoIcon.jsx'
import InfoIconHover from '@/components/common/InfoIconHover.jsx'
import { formatNumber } from '@/utils/format'

const GrayContainer = ({ title, end, showWithdrawBtn = false, handleWithdraw, modifier, symbol, tootlipText }) => {
  const [isHover, setHover] = useState(false)
  const { accountAddress } = useSelector(state => state.network)
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
    <div className={classNames('gray_container', { [modifier]: modifier })}>
      <div className='grid-x align-justify align-middle'>
        <div className='title'>{title}</div>
        <div
          className='info'
          data-tip
          data-event='click focus'
          data-for={title}
          onMouseEnter={() => {
            setHover(true)
          }}
          onMouseLeave={() => {
            setHover(false)
          }}
        >
          {
            isHover
              ? <InfoIconHover fill='#7E8AB4' />
              : <InfoIcon fill='#869AAC' />
          }
          <ReactTooltip className='tooltip' globalEventOff='click' id={title} place='top' effect='solid'>
            <div>{tootlipText}</div>
          </ReactTooltip>
        </div>
      </div>
      <div className='grid-x align-justify align-middle'>
        <div className={classNames('value', { 'value--disabled': !accountAddress })}>{countUp} - {symbol}</div>
        {
          showWithdrawBtn && (
            <button onClick={handleWithdraw} className='withdraw_stake'>
              Claim FUSE
            </button>
          )
        }
      </div>
    </div>
  )
}

export default GrayContainer
