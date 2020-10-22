import React, { useEffect } from 'react'
import classNames from 'classnames'
import { useSelector } from 'react-redux'
// import InfoIcon from '@/components/common/InfoIcon.jsx'
import { useCountUp } from 'react-countup'
import { formatNumber } from '@/utils/format'

const GrayContainer = ({ title, end, showWithdrawBtn = false, handleWithdraw, modifier, symbol }) => {
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
    <div className={`gray_container ${modifier}`}>
      <div className='grid-x align-justify align-middle'>
        <div className='title'>{title}</div>
        {/* <InfoIcon fill='#869AAC' /> */}
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
