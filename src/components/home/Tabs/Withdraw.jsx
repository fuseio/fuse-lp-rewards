import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withdrawStakeAndInterest } from '@/actions/mining'
import { object, number } from 'yup'
import { Formik, Field } from 'formik'
import { toWei, formatWei } from '@/utils/format'

const Scheme = object().noUnknown(false).shape({
  amount: number().positive()
})

const WithdrawForm = () => {
  const dispatch = useDispatch()
  const { amountStaked = 0 } = useSelector(state => state.staking)

  const onSubmit = (values) => {
    const { amount } = values
    dispatch(withdrawStakeAndInterest(toWei(amount)))
  }

  const renderForm = ({ handleSubmit }) => {
    return (
      <form onSubmit={handleSubmit} className='withdraw'>
        <div className='input__wrapper'>
          <div className='balance'>Balance - {formatWei(amountStaked)} FUSE</div>
          <div className='input'>
            <Field name='amount'>
              {({
                field
              }) => (
                <input {...field} placeholder='0.00' />
              )}
            </Field>
            <span className='symbol'>FUSE</span>
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
