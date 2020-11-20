import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import InfoIcon from '@/components/common/InfoIcon.jsx'
import InfoIconHover from '@/components/common/InfoIconHover.jsx'
import { useCountUp } from 'react-countup'
import ReactModal from 'react-modal'
import { useModal } from 'react-modal-hook'
import { formatNumber } from '@/utils/format'
import InfoIconModal from '@/assets/images/info-icon-modal.svg'

export default ({ Icon, name, title, end, withSymbol = true, modalText, symbol, link }) => {
  const { accountAddress } = useSelector(state => state.network)
  const [isHover, setHover] = useState(false)
  const [modalStatus, setModalStatus] = useState(false)
  const { countUp, start, update } = useCountUp({
    formattingFn: formatNumber,
    end
  })

  const [showModal] = useModal(() => (
    <ReactModal isOpen={modalStatus} overlayClassName='modal__overlay' className='modal__content'>
      <div className='info-modal'>
        <div className='image'><img src={InfoIconModal} /></div>
        <div className='title'>
          What does “{title}” mean?
        </div>
        <div className='text'>
          {modalText}
        </div>
        <button
          className='close'
          onClick={() => {
            setModalStatus(false)
          }}
        >
          Close
        </button>
      </div>
    </ReactModal>
  ), [modalStatus])

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
          onClick={() => {
            showModal()
            setModalStatus(true)
          }}
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
            ? (
              <div className={classNames('info_box__value', { 'info_box__value--disabled': !accountAddress })}>
                {countUp}&nbsp;

                {
                  link ? (
                    <a
                      rel='noreferrer noopener'
                      target='_blank'
                      href={link}
                    >
                      {symbol}
                    </a>
                  ) : (
                    <span>{symbol}</span>
                  )
                }
              </div>
            )
            : <div className={classNames('info_box__value', { 'info_box__value--disabled': !accountAddress })}>{countUp} %</div>
        }
        <div className={classNames('info_box__title', { 'info_box__title--disabled': !accountAddress })}>{title}</div>
      </div>
    </div>
  )
}
