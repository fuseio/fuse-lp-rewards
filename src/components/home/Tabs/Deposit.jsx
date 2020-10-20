import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { depositStake, approveToken } from '@/actions/staking'
import FuseLoader from '@/assets/images/loader-fuse.gif'
import { object, number, mixed } from 'yup'
import { Formik, Field } from 'formik'
import { toWei, formatWei } from '@/utils/format'
import get from 'lodash/get'
import { BigNumber } from 'bignumber.js'

const Scheme = object().noUnknown(false).shape({
  amount: number().positive(),
  submitType: mixed().oneOf(['stake', 'approve']).required().default('stake')
})

const DepositForm = () => {
  const dispatch = useDispatch()
  const { accountAddress } = useSelector(state => state.network)
  const { isApproving, isDeposit } = useSelector(state => state.screens.deposit)
  const accounts = useSelector(state => state.accounts)
  const balance = get(accounts, [accountAddress, 'balances', CONFIG.stakeToken], 0)
  const amountApprove = get(accounts, [accountAddress, 'allowance', CONFIG.stakeToken], 0)

  const onSubmit = (values, formikBag) => {
    const { amount, submitType } = values
    if (submitType === 'approve') {
      dispatch(approveToken(toWei(amount)))
    } else {
      dispatch(depositStake(toWei(amount)))
    }
  }

  const renderForm = ({ handleSubmit, values, setFieldValue }) => {
    const { amount } = values
    const showApprove = new BigNumber(amountApprove).isLessThan(toWei(amount))
    return (
      <form onSubmit={handleSubmit} className='form form--deposit'>
        <div className='input__wrapper'>
          <div className='balance'>Balance - {formatWei(balance)} LP</div>
          <div className='input'>
            <Field name='amount'>
              {({
                field
              }) => (
                <input
                  {...field}
                  autoComplete='off'
                  placeholder='0.00'
                />
              )}
            </Field>
            <span className='symbol'>LP</span>
          </div>
          {
            showApprove && (
              <button
                onClick={() => {
                  setFieldValue('submitType', 'approve')
                }}
                className='button'
              >
              Approve&nbsp;&nbsp;
                {
                  isApproving && <img src={FuseLoader} alt='Fuse loader' />
                }
              </button>
            )
          }
          <button
            onClick={() => {
              setFieldValue('submitType', 'stake')
            }}
            disabled={showApprove}
            className='button'
          >
            Deposit&nbsp;&nbsp;
            {
              isDeposit && <img src={FuseLoader} alt='Fuse loader' />
            }
          </button>
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
      validateOnChange
    />
  )
}

export default DepositForm
