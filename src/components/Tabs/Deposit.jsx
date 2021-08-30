import React from 'react'
import ReactGA from 'react-ga4'
import { useDispatch, useSelector } from 'react-redux'
import { object, number, mixed } from 'yup'
import { Formik, Field, Form } from 'formik'
import { BigNumber } from 'bignumber.js'
import classNames from 'classnames'
import get from 'lodash/get'
import { utils as web3Utils } from 'web3'
import moment from 'moment'

import { formatWei, formatWeiToNumber, symbolFromPair } from '@/utils/format'
import GrayContainer from '@/components/common/GrayContainer.jsx'
import { depositStake, approveToken } from '@/actions/staking'
import FuseLoader from '@/assets/images/loader-fuse.gif'
import walletIcon from '@/assets/images/wallet.svg'
import PercentageSelector from './PercentageSelector'
import useSwitchNetwork from '@/hooks/useSwitchNetwork'
import { getNetworkName } from '@/utils/network'
import { getPlatformPairName, getRewardTokenName, getContractRewardType } from '@/utils'
import useIsStakingNetwork from '@/hooks/useIsStakingNetwork'
import { DEPOSIT_BLACKLIST } from '@/constants'

const Scheme = object().noUnknown(false).shape({
  amount: number().positive().required(),
  submitType: mixed().oneOf(['stake', 'approve']).required().default('stake')
})

const calcRewardsPerToken = (lockedRewards, total, amountToStake) => new BigNumber(lockedRewards).dividedBy(new BigNumber(total).plus(new BigNumber(amountToStake)))

const DepositForm = ({ handleConnect }) => {
  const dispatch = useDispatch()
  const { accountAddress } = useSelector(state => state.network)
  const { stakingContract, lpToken, pairName, networkId: stakingNetworkId } = useSelector(state => state.staking)
  const stakingContracts = useSelector(state => state.entities.stakingContracts)
  const { isApproving, isDeposit } = useSelector(state => state.screens.deposit)
  const accounts = useSelector(state => state.accounts)
  const switchNetwork = useSwitchNetwork()
  const isStakingNetwork = useIsStakingNetwork()
  const isDepositBlacklisted = DEPOSIT_BLACKLIST.includes(stakingContract)

  const balance = get(accounts, [accountAddress, 'balances', lpToken], 0)
  const amountApprove = get(accounts, [accountAddress, 'allowance', lpToken], 0)
  const lockedRewards = get(stakingContracts, [stakingContract, 'lockedRewards'], 0)
  const globalTotalStake = get(stakingContracts, [stakingContract, 'globalTotalStake'], 0)
  const totalStaked = get(stakingContracts, [stakingContract, 'totalStaked'], 0)
  const rewardRate = get(stakingContracts, [stakingContract, 'rewardRate'], 0)
  const stakingEndTime = get(stakingContracts, [stakingContract, 'stakingEndTime'], 0)
  const symbol = `${getPlatformPairName(stakingNetworkId)} ${symbolFromPair(pairName)}`
  const rewardType = getContractRewardType(stakingContract)

  const onSubmit = (values, formikBag) => {
    const { amount, submitType } = values
    if (submitType === 'approve') {
      dispatch(approveToken(web3Utils.toWei(amount)))
    } else {
      dispatch(depositStake(web3Utils.toWei(amount)))
    }
    ReactGA.event({
      category: 'action',
      action: `Action - ${submitType}`,
      label: `${submitType} ${amount} into staking contract: ${stakingContract} `
    })
  }

  const renderForm = ({ values, setFieldValue }) => {
    const { amount } = values
    const amountToStake = amount ? web3Utils.toWei(amount).toString() : 0
    const showApprove = new BigNumber(amountApprove).isLessThan(amountToStake)
    const rewardsPerToken = rewardType === 'single' 
      ? calcRewardsPerToken(lockedRewards, globalTotalStake, amountToStake)
      : new BigNumber(stakingEndTime - moment().unix())
        .multipliedBy(rewardRate)
        .dividedBy(new BigNumber(globalTotalStake).plus(amountToStake))
    const estimatedAmount = rewardsPerToken.multipliedBy(new BigNumber(amountToStake).plus(totalStaked))
    const disableDeposit = showApprove || !amount
    return (
      <Form className='form form--deposit'>
        <div className='input__wrapper'>
          <div className={classNames('balance', { 'balance--disabled': !accountAddress })}>Balance - <span>{formatWei(balance)} {symbol}</span></div>
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
            <span className='symbol'>{symbol}</span>
          </div>
        </div>
        <PercentageSelector balance={balance} />
        <GrayContainer
          decimals={2}
          tootlipText='Your estimated rewards reflect the amount of $FUSE you are expected to receive by the end of the program assuming there are no changes in deposits.'
          modifier='gray_container--fix-width'
          symbol={getRewardTokenName(stakingNetworkId)}
          title='your estimated rewards'
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
          accountAddress && isStakingNetwork && !isDepositBlacklisted && (
            <button
              onClick={() => {
                setFieldValue('submitType', 'stake')
              }}
              disabled={disableDeposit}
              className='button'
            >
              Deposit&nbsp;&nbsp;
              {isDeposit && <img src={FuseLoader} alt='Fuse loader' />}
            </button>
          )
        }
        {
          accountAddress && !isStakingNetwork && (
            <button
              onClick={() => switchNetwork(stakingNetworkId)}
              className='button'
            >
              Switch to {getNetworkName(stakingNetworkId)}
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
      enableReinitialize
      validateOnChange
    />
  )
}

export default DepositForm
