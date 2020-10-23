import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { object, number, mixed } from 'yup'
import { Formik, Field, Form } from 'formik'
import { BigNumber } from 'bignumber.js'
import classNames from 'classnames'
import get from 'lodash/get'

import { toWei, formatWei, formatWeiToNumber } from '@/utils/format'
import GrayContainer from '@/components/common/GrayContainer.jsx'
import { depositStake, approveToken } from '@/actions/staking'
import FuseLoader from '@/assets/images/loader-fuse.gif'
import walletIcon from '@/assets/images/wallet.svg'
import PercentageSelector from './PercentageSelector'

const Scheme = object().noUnknown(false).shape({
  amount: number().positive().required(),
  percent: mixed().oneOf([25, 50, 75, 100]),
  submitType: mixed().oneOf(['stake', 'approve']).required().default('stake')
})

const DepositForm = ({ handleConnect }) => {
  const dispatch = useDispatch()
  const { accountAddress } = useSelector(state => state.network)
  const { rewardsPerToken, totalStaked = 0 } = useSelector(state => state.staking)
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

  const renderForm = ({ values, setFieldValue, dirty, isValid, errors }) => {
    const { amount } = values
    const showApprove = new BigNumber(amountApprove).isLessThan(toWei(amount))
    const estimatedAmount = new BigNumber(rewardsPerToken).multipliedBy(new BigNumber(toWei(amount)).plus(totalStaked))
    return (
      <Form className='form form--deposit'>
        <div className='input__wrapper'>
          <div className={classNames('balance', { 'balance--disabled': !accountAddress })}>Balance - <span>{formatWei(balance)} UNI FUSE-ETH</span></div>
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
            <span className='symbol'>UNI FUSE-ETH</span>
          </div>
        </div>
        <PercentageSelector balance={balance} />
        <GrayContainer modifier='gray_container--fix-width' symbol='FUSE' title='your estimated rewards' end={isNaN(formatWeiToNumber(estimatedAmount)) ? 0 : formatWeiToNumber(estimatedAmount)} />
        {
          showApprove && accountAddress && (
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
        {
          accountAddress && (
            <button
              onClick={() => {
                setFieldValue('submitType', 'stake')
              }}
              disabled={showApprove || !(isValid && dirty)}
              className='button'
            >
              Deposit&nbsp;&nbsp;
              {isDeposit && <img src={FuseLoader} alt='Fuse loader' />}
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
              className='button'
            >
              <img style={{ width: '16px', marginRight: '.5em' }} className='icon' src={walletIcon} />
              Connect wallet
            </button>
          )
        }
      </Form>
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
