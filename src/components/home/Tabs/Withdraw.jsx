import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withdrawStakeAndInterest } from '@/actions/staking'
import { object, number } from 'yup'
import { Formik, Field } from 'formik'
import { toWei, formatWei } from '@/utils/format'

const Scheme = object().noUnknown(false).shape({
  amount: number().positive()
})

const WithdrawForm = () => {
  const dispatch = useDispatch()
  const { totalStaked = 0 } = useSelector(state => state.staking)

  const onSubmit = (values, formikBag) => {
    const { amount } = values
    dispatch(withdrawStakeAndInterest(toWei(amount)))
  }

  const renderForm = ({ handleSubmit }) => {
    return (
      <form onSubmit={handleSubmit} className='form form--withdraw'>
        <div className='input__wrapper'>
          <div className='balance'>Deposited balance - {formatWei(totalStaked)} LP</div>
          <div className='input'>
            <Field name='amount'>
              {({
                field
              }) => (
                <input {...field} placeholder='0.00' autoComplete='off' />
              )}
            </Field>
            <span className='symbol'>LP</span>
          </div>
          <button type='submit' className='button'>Withdraw</button>
        </div>
      </form>
    )
  }

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

export default WithdrawForm
