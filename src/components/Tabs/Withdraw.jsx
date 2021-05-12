import React from 'react'
import ReactGA from 'react-ga'
import get from 'lodash/get'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { utils as web3Utils } from 'web3'

import { withdrawStakeAndInterest, withdrawInterest } from '@/actions/staking'
import { object, number, mixed } from 'yup'
import { Formik, Field, Form } from 'formik'
import { toWei, formatWei, formatWeiToNumber, symbolFromPair } from '@/utils/format'
import GrayContainer from '@/components/common/GrayContainer.jsx'
import walletIcon from '@/assets/images/wallet.svg'
import FuseLoader from '@/assets/images/loader-fuse.gif'
import PercentageSelector from './PercentageSelector'
import useIsStakingNetwork from '@/hooks/useIsStakingNetwork'
import useSwitchNetwork from '@/hooks/useSwitchNetwork'
import { getNetworkName } from '@/utils/network'
import { getPlatformPairName, getRewardTokenName } from '@/utils'

const Scheme = object().noUnknown(false).shape({
  amount: number().positive(),
  submitType: mixed().oneOf(['withdrawStakeAndInterest', 'withdrawInterest']).required().default('withdrawStakeAndInterest')
})

const WithdrawForm = ({ handleConnect }) => {
  const { accountAddress } = useSelector(state => state.network)
  const dispatch = useDispatch()
  const { stakingContract, pairName, networkId } = useSelector(state => state.staking)
  const stakingContracts = useSelector(state => state.entities.stakingContracts)
  const { isWithdraw } = useSelector(state => state.screens.withdraw)
  const isStakingNetwork = useIsStakingNetwork()
  const switchNetwork = useSwitchNetwork()

  const totalStaked = get(stakingContracts, [stakingContract, 'totalStaked'], 0)
  const accruedRewards = get(stakingContracts, [stakingContract, 'accruedRewards'], 0)
  const withdrawnToDate = get(stakingContracts, [stakingContract, 'withdrawnToDate'], 0)
  const symbol = `${getPlatformPairName(networkId)} ${symbolFromPair(pairName)}`

  const onSubmit = (values, formikBag) => {
    const { amount, submitType } = values
    if (submitType === 'withdrawInterest') {
      dispatch(withdrawInterest())
    } else if (submitType === 'withdrawStakeAndInterest') {
      dispatch(withdrawStakeAndInterest(web3Utils.toWei(amount)))
    }
    ReactGA.event({
      category: 'action',
      action: `Action - ${submitType}`,
      label: `${submitType} ${amount} from staking contract: ${stakingContract} `
    })
  }

  const renderForm = ({ values, setFieldValue, dirty, isValid }) => {
    const { amount } = values
    return (
      <Form className='form form--withdraw'>
        <div className='input__wrapper'>
          <div className={classNames('balance', { 'balance--disabled': !accountAddress })}>Deposited balance - <span>{formatWei(totalStaked)} {symbol}</span></div>
          <div className='input'>
            <Field name='amount'>
              {({ field }) => <input {...field} placeholder='0.00' autoComplete='off' />}
            </Field>
            <span className='symbol'>{symbol}</span>
          </div>
        </div>
        <PercentageSelector balance={totalStaked} />
        <div className='gray_container__wrapper'>
          <GrayContainer
            symbol={getRewardTokenName(networkId)}
            tootlipText='Rewarded FUSEs available for claim.'
            title='Rewards to withdraw'
            end={isNaN(formatWeiToNumber(accruedRewards)) ? 0 : formatWeiToNumber(accruedRewards)}
            showWithdrawBtn={isStakingNetwork && formatWeiToNumber(accruedRewards) > 0}
            handleWithdraw={() => {
              setFieldValue('submitType', 'withdrawInterest')
            }}
          />
          <GrayContainer
            symbol={getRewardTokenName(networkId)}
            tootlipText='Rewarded FUSEs already claimed.'
            title='rewards claimed'
            end={isNaN(formatWeiToNumber(withdrawnToDate))
              ? 0
              : formatWeiToNumber(withdrawnToDate)}
          />
        </div>
        {
          accountAddress && isStakingNetwork && (
            <button
              onClick={() => {
                setFieldValue('submitType', 'withdrawStakeAndInterest')
              }}
              disabled={!(isValid && dirty && amount)}
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
          accountAddress && !isStakingNetwork && (
            <button 
              onClick={() => switchNetwork(networkId)}
              className="button"
            >
              Switch to {getNetworkName(networkId)}
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
      enableReinitialize
      validateOnChange
    />
  )
}
export default WithdrawForm
