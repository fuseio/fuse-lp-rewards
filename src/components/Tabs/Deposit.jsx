import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { object, number, mixed } from 'yup'
import { Formik, Field, Form } from 'formik'
import { BigNumber } from 'bignumber.js'
import classNames from 'classnames'
import get from 'lodash/get'
import replace from 'lodash/replace'

import { toWei, formatWei, formatWeiToNumber } from '@/utils/format'
import GrayContainer from '@/components/common/GrayContainer.jsx'
import { depositStake, approveToken } from '@/actions/staking'
import FuseLoader from '@/assets/images/loader-fuse.gif'
import walletIcon from '@/assets/images/wallet.svg'
import PercentageSelector from './PercentageSelector'

const Scheme = object().noUnknown(false).shape({
  amount: number().positive().required(),
  submitType: mixed().oneOf(['stake', 'approve']).required().default('stake')
})

const calcRewardsPerToken = (lockedRewards, total, amountToStake) => new BigNumber(lockedRewards).dividedBy(new BigNumber(total).plus(new BigNumber(amountToStake)))

const DepositForm = ({ handleConnect }) => {
  const dispatch = useDispatch()
  const { accountAddress } = useSelector(state => state.network)
  const { stakingContract, lpToken, pairName } = useSelector(state => state.staking)
  const stakingContracts = useSelector(state => state.entities.stakingContracts)
  const { isApproving, isDeposit } = useSelector(state => state.screens.deposit)
  const accounts = useSelector(state => state.accounts)
  const balance = get(accounts, [accountAddress, 'balances', lpToken], 0)
  const amountApprove = get(accounts, [accountAddress, 'allowance', lpToken], 0)
  const lockedRewards = get(stakingContracts, [stakingContract, 'lockedRewards'], 0)
  const globalTotalStake = get(stakingContracts, [stakingContract, 'globalTotalStake'], 0)
  const totalStaked = get(stakingContracts, [stakingContract, 'totalStaked'], 0)

  const onSubmit = (values, formikBag) => {
    const { amount, submitType } = values
    if (submitType === 'approve') {
      dispatch(approveToken(toWei(amount)))
    } else {
      dispatch(depositStake(toWei(amount)))
    }
  }

  const renderForm = ({ values, setFieldValue, dirty, isValid }) => {
    const { amount } = values
    const amountToStake = toWei(amount)
    const showApprove = new BigNumber(amountApprove).isLessThan(amountToStake)
    const rewardsPerToken = calcRewardsPerToken(lockedRewards, globalTotalStake, amountToStake)
    const estimatedAmount = rewardsPerToken.multipliedBy(new BigNumber(amountToStake).plus(totalStaked))
    const symbol = replace(pairName, '/', '-')
    return (
      <Form className='form form--deposit'>
        <div className='input__wrapper'>
          <div className={classNames('balance', { 'balance--disabled': !accountAddress })}>Balance - <span>{formatWei(balance)} UNI {symbol}</span></div>
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
            <span className='symbol'>UNI {symbol}</span>
          </div>
        </div>
        <PercentageSelector balance={balance} />
        <GrayContainer
          tootlipText='Your estimated rewards reflect the amount of $FUSE you are expected to receive by the end of the program assuming there are no changes in deposits.'
          modifier='gray_container--fix-width'
          symbol='FUSE' title='your estimated rewards'
          end={isNaN(formatWeiToNumber(estimatedAmount)) ? 0 : formatWeiToNumber(estimatedAmount)}
        />
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
