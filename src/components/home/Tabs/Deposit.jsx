import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { depositStake } from '@/actions/staking'
import { object, number } from 'yup'
import { Formik, Field } from 'formik'
import { toWei, formatWei } from '@/utils/format'
import get from 'lodash/get'

const Scheme = object().noUnknown(false).shape({
  amount: number().positive()
})

const DepositForm = () => {
  const dispatch = useDispatch()
  const { accountAddress } = useSelector(state => state.network)
  const accounts = useSelector(state => state.accounts)
  const balance = get(accounts, [accountAddress, 'balances', CONFIG.stakeToken], 0)

  const onSubmit = (values) => {
    const { amount } = values
    dispatch(depositStake(toWei(amount)))
  }

  const renderForm = ({ handleSubmit }) => {
    return (
      <form onSubmit={handleSubmit} className='deposit'>
        <div className='input__wrapper'>
          <div className='balance'>Balance - {formatWei(balance)} LP</div>
          <div className='input'>
            <Field name='amount'>
              {({
                field
              }) => (
                <input {...field} placeholder='0.00' />
              )}
            </Field>
            <span className='symbol'>LP</span>
          </div>
          <button type='submit' className='button'>Deposit</button>
        </div>
      </form>
    )
  }

  // return (
  //   <div className='deposit'>
  //     <div className='input__wrapper'>
  //       <div className='balance'>Balance - LP</div>
  //       <div className='input'>
  //         <input placeholder='0.00' type='number' />
  //         <span className='symbol'>LP</span>
  //       </div>
  //       <button className='button'>Deposit</button>
  //     </div>
  //   </div>
  // )

  return (
    <Formik
      initialValues={{
        amount: ''
      }}
      validationSchema={Scheme}
      render={renderForm}
      onSubmit={onSubmit}
      enableReinitialize
      validateOnChange
    />
  )
}

export default DepositForm
