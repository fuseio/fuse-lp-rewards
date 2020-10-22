import React from 'react'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { withdrawStakeAndInterest, withdrawInterest } from '@/actions/staking'
import { object, number, mixed } from 'yup'
import { Formik, Field } from 'formik'
import { toWei, formatWei, formatWeiToNumber } from '@/utils/format'
import GrayContainer from '@/components/common/GrayContainer.jsx'
import walletIcon from '@/assets/images/wallet.svg'
import FuseLoader from '@/assets/images/loader-fuse.gif'

const Scheme = object().noUnknown(false).shape({
  amount: number().positive(),
  submitType: mixed().oneOf(['withdrawStakeAndInterest', 'withdrawInterest']).required().default('withdrawStakeAndInterest')
})

const WithdrawForm = ({ handleConnect }) => {
  const { accountAddress } = useSelector(state => state.network)
  const dispatch = useDispatch()
  const { totalStaked = 0, accruedRewards = 0, withdrawnToDate = 0 } = useSelector(state => state.staking)
  const { isWithdraw } = useSelector(state => state.screens.withdraw)

  const onSubmit = (values, formikBag) => {
    const { amount, submitType } = values
    if (submitType === 'withdrawInterest') {
      dispatch(withdrawInterest(toWei(amount)))
    } else if (submitType === 'withdrawStakeAndInterest') {
      dispatch(withdrawStakeAndInterest(toWei(amount)))
    }
  }

  const renderForm = ({ handleSubmit, setFieldValue, dirty, isValid }) => {
    return (
      <form onSubmit={handleSubmit} className='form form--withdraw'>
        <div className='input__wrapper'>
          <div className={classNames('balance', { 'balance--disabled': !accountAddress })}>Deposited balance - <span>{formatWei(totalStaked)} UNI FUSE-ETH</span></div>
          <div className='input'>
            <Field name='amount'>
              {({
                field
              }) => (
                <input {...field} placeholder='0.00' autoComplete='off' />
              )}
            </Field>
            <span className='symbol'>UNI FUSE-ETH</span>
          </div>
        </div>
        <div className='gray_container__wrapper'>
          <GrayContainer
            symbol='FUSE'
            title='Rewards to withdraw'
            end={isNaN(formatWeiToNumber(accruedRewards)) ? 0 : formatWeiToNumber(accruedRewards)}
            showWithdrawBtn={formatWeiToNumber(accruedRewards) > 0}
            handleWithdraw={() => {
              setFieldValue('submitType', 'withdrawInterest')
            }}
          />
          <GrayContainer
            symbol='FUSE'
            title='rewards claimed'
            end={isNaN(formatWeiToNumber(withdrawnToDate))
              ? 0
              : formatWeiToNumber(withdrawnToDate)}
          />
        </div>
        {
          accountAddress && (
            <button
              onClick={() => {
                setFieldValue('submitType', 'withdrawStakeAndInterest')
              }}
              disabled={!(isValid && dirty)}
              className='button'
            >
              Withdraw&nbsp;&nbsp;
              {
                isWithdraw && <img src={FuseLoader} alt='Fuse loader' />
              }
            </button>
          )
        }
        {
          !accountAddress && (
            <button
              onClick={(e) => {
                e.preventDefault()
                handleConnect()
              }}
              type='submit'
              className='button'
            >
              <img style={{ width: '16px', marginRight: '.5em' }} className='icon' src={walletIcon} />
              Connect wallet
            </button>
          )
        }
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
