import React from 'react'
import { useDispatch } from 'react-redux'
import { withdrawStakeAndInterest } from '@/actions/mining'
import { object, number } from 'yup'
import { Formik, Field } from 'formik'

const Scheme = object().noUnknown(false).shape({
  amount: number().positive()
})

const WithdrawForm = () => {
  const dispatch = useDispatch()

  const onSubmit = (values) => {
    const { amount } = values
    dispatch(withdrawStakeAndInterest(amount))
  }

  const renderForm = ({ handleSubmit }) => {
    return (
      <form onSubmit={handleSubmit} className='withdraw'>
        <div className='input__wrapper'>
          <div className='balance'>Balance - LP</div>
          <div className='input'>
            <Field name="amount">
              {({
                field,
              }) => (
                  <input {...field} placeholder='0.00' type='number' />
                )}
            </Field>
            <span className='symbol'>LP</span>
          </div>
          <button type="submit" className='button'>Withdraw</button>
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
