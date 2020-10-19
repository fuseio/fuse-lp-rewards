import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

const DepositForm = () => {
  const dispatch = useDispatch()
  return (
    <div className='deposit'>
      <div className='input__wrapper'>
        <div className='balance'>Balance - LP</div>
        <div className='input'>
          <input placeholder='0.00' type='number' />
          <span className='symbol'>LP</span>
        </div>
        <button className='button'>Deposit</button>
      </div>
    </div>
  )
}

export default DepositForm
