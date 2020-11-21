import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Redirect } from 'react-router'
import { BigNumber } from 'bignumber.js'
import ReactModal from 'react-modal'
import { useModal } from 'react-modal-hook'
import replace from 'lodash/replace'
import get from 'lodash/get'
import InfoBox from '@/components/common/InfoBox.jsx'
import Tabs from '@/components/Tabs'
import briefcaseIcongray from '@/assets/images/briefcase-check-gray.svg'
import briefcaseIcon from '@/assets/images/briefcase-check.svg'
import walletIcon from '@/assets/images/wallet-plus.svg'
import walletIcongray from '@/assets/images/wallet-plus-gray.svg'
import percentageIcon from '@/assets/images/percentage.svg'
import percentageIcongray from '@/assets/images/percentage-gray.svg'
import { formatWeiToNumber } from '@/utils/format'
import useInterval from '@/hooks/useInterval'
import { getStatsData } from '@/actions/staking'

export default ({ handleConnect }) => {
  const dispatch = useDispatch()
  const { stakingContract, pairName, lpToken, uniPairToken, networkId: stakingNetworkId } = useSelector(state => state.staking)
  const stakingContracts = useSelector(state => state.entities.stakingContracts)
  const { accountAddress, networkId } = useSelector(state => state.network)
  const [isRunning, setIsRunning] = useState(!!accountAddress)
  const accruedRewards = get(stakingContracts, [stakingContract, 'accruedRewards'], 0)
  const withdrawnToDate = get(stakingContracts, [stakingContract, 'withdrawnToDate'], 0)
  const accrued = new BigNumber(withdrawnToDate).plus(new BigNumber(accruedRewards))
  const totalStaked = get(stakingContracts, [stakingContract, 'totalStaked'], 0)
  const symbol = replace(pairName, '/', '-')

  if (!stakingContract) {
    return <Redirect to='/' />
  }

  useEffect(() => {
    if (accountAddress) {
      setIsRunning(true)
    }
  }, [accountAddress])

  useInterval(() => {
    console.log({ lpToken: stakingNetworkId === 1 ? lpToken : uniPairToken })
    dispatch(getStatsData(stakingContract, stakingNetworkId === 1 ? lpToken : uniPairToken, networkId))
  }, isRunning ? 5000 : null)

  const [modalStatus, setModalStatus] = useState(false)

  const [showModal] = useModal(() => (
    <ReactModal isOpen={modalStatus} overlayClassName='modal__overlay' className='modal__content'>
      <div className='info-modal'>
        <div className='title center'>
          Switch to {networkId === 1 ? 'Fuse' : 'Mainnet'} network
        </div>
        <button
          className='close'
          onClick={() => { setModalStatus(false) }}
        >
          Close
        </button>
      </div>
    </ReactModal>
  ), [modalStatus])

  useEffect(() => {
    if (networkId) {
      if (networkId !== stakingNetworkId) {
        showModal()
        setModalStatus(true)
      }
      if (networkId === stakingNetworkId) {
        setModalStatus(false)
      }
    }
  }, [networkId])

  return (
    <div className='main__wrapper'>
      <div className='main'>
        <h1 className='title'>Add liquidity</h1>
        <div className='boxs'>
          <InfoBox
            name='apy'
            modalText='APY - Annual Percentage Yield (APY) is the estimated yearly yield for tokens locked. Our calculation is " $ locked * (1 year in second)/(total stake in $ * time remaining in seconds).'
            withSymbol={false}
            end={parseInt(0)}
            title='Deposit APY'
            Icon={() => (
              <img src={accountAddress ? percentageIcon : percentageIcongray} />
            )}
          />
          <InfoBox
            name='deposits'
            symbol={symbol}
            modalText='Your Deposits - Your deposits shows the total amount of FUSE you have deposited into the Staking Contract.'
            title='Your deposits'
            end={formatWeiToNumber(totalStaked)}
            Icon={() => (
              <img src={accountAddress ? briefcaseIcon : briefcaseIcongray} />
            )}
          />
          <InfoBox
            link='https://etherscan.io/token/0x970B9bB2C0444F5E81e9d0eFb84C8ccdcdcAf84d'
            name='rewards'
            symbol='FUSE'
            modalText={"Accrued Rewards - Accrued Rewards refers to the total FUSE you've earned for your stake"}
            end={formatWeiToNumber(accrued)}
            title='Accrued rewards'
            Icon={() => (
              <img src={accountAddress ? walletIcon : walletIcongray} />
            )}
          />
        </div>
        <Tabs handleConnect={handleConnect} />
      </div>
    </div>
  )
}
