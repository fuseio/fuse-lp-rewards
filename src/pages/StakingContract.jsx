import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Redirect } from 'react-router'
import { BigNumber } from 'bignumber.js'
import ReactModal from 'react-modal'
import { useModal } from 'react-modal-hook'
import get from 'lodash/get'
import InfoBox from '@/components/common/InfoBox.jsx'
import Tabs from '@/components/Tabs'
import briefcaseIcongray from '@/assets/images/briefcase-check-gray.svg'
import briefcaseIcon from '@/assets/images/briefcase-check.svg'
import walletIcon from '@/assets/images/wallet-plus.svg'
import SwitchToFuse from '@/assets/images/step_1.png'
import SwitchToFuseGuide from '@/assets/images/step_2.png'
import SwitchToMainnet from '@/assets/images/Switch_To_Main.png'
import walletIcongray from '@/assets/images/wallet-plus-gray.svg'
import percentageIcon from '@/assets/images/percentage.svg'
import percentageIcongray from '@/assets/images/percentage-gray.svg'
import { formatWeiToNumber, symbolFromPair } from '@/utils/format'
import { getBlockExplorerUrl } from '@/utils/network'
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
  const apyPercent = get(stakingContracts, [stakingContract, 'apyPercent'], 0)
  const accrued = new BigNumber(withdrawnToDate).plus(new BigNumber(accruedRewards))
  const totalStaked = get(stakingContracts, [stakingContract, 'totalStaked'], 0)
  const isExpired = get(stakingContracts, [stakingContract, 'isExpired'])
  const symbol = symbolFromPair(pairName)

  if (!stakingContract) {
    return <Redirect to='/' />
  }

  useEffect(() => {
    if (accountAddress) {
      setIsRunning(true)
    }
  }, [accountAddress])

  useInterval(() => {
    dispatch(getStatsData(stakingContract, stakingNetworkId === 1 ? lpToken : uniPairToken, networkId))
  }, isRunning ? 5000 : null)

  const [modalStatus, setModalStatus] = useState(false)
  const [secondModalStatus, setSecondModalStatus] = useState(false)

  const [showSecondModal] = useModal(() => (
    <ReactModal isOpen={secondModalStatus} overlayClassName='modal__overlay' className='modal__content'>
      <div className='info-modal'>
        <div className='title'>
          Add Fuse network to Metamask
        </div>
        <div>
          <img src={SwitchToFuseGuide} />
        </div>
        <div className='text grid-y'>
          <div className='grid-x cell align-middle shrink'>
            <strong>Network name: </strong>
            &nbsp;Fuse network
          </div>
          <div className='grid-x cell align-middle shrink'>
            <strong>RPC Url: </strong>
            &nbsp;https://rpc.fuse.io
          </div>
          <div className='grid-x cell align-middle shrink'>
            <strong>ChainID: </strong>
            &nbsp;0x7a
          </div>
          <div className='grid-x cell align-middle shrink'>
            <strong>Symbol: </strong>
            &nbsp;FUSE
          </div>
          <div className='grid-x cell align-middle shrink'>
            <strong>Explorer: </strong>
            &nbsp;https://explorer.fuse.io
          </div>
        </div>
        <button
          className='close'
          onClick={() => {
            setSecondModalStatus(false)
          }}
        >
          Close
        </button>
      </div>
    </ReactModal>
  ), [secondModalStatus])

  const [showModal] = useModal(() => (
    <ReactModal isOpen={modalStatus} overlayClassName='modal__overlay' className='modal__content'>
      <div className='info-modal'>
        <div className='title center'>
          Switch to {networkId === 1 ? 'Fuse' : 'Mainnet'} network
        </div>
        {
          networkId === 1 ? (
            <>
              <div>
                <img src={SwitchToFuse} />
              </div>
              <div className='text'>
                Click
                <strong
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setModalStatus(false)
                    showSecondModal()
                    setSecondModalStatus(true)
                  }}
                >
                  {' here '}
                </strong>
              to learn how to add Fuse network to Metamask
              </div>
            </>
          ) : (
            <div>
              <img src={SwitchToMainnet} />
            </div>
          )
        }
        {/* <button
          className='close'
          onClick={() => { setModalStatus(false) }}
        >
          Close
        </button> */}
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
            end={!isExpired ? parseInt(apyPercent) : 0}
            title='Deposit APY'
            Icon={() => (
              <img src={accountAddress ? percentageIcon : percentageIcongray} />
            )}
          />
          <InfoBox
            name='deposits'
            symbol={symbol}
            modalText='Your Deposits - Your deposits shows the total amount of FUSE you have deposited into the Staking Contract.'
            decimals={2}
            title='Your deposits'
            end={formatWeiToNumber(totalStaked)}
            Icon={() => (
              <img src={accountAddress ? briefcaseIcon : briefcaseIcongray} />
            )}
          />
          <InfoBox
            link={`${getBlockExplorerUrl(stakingNetworkId)}/address/${CONFIG.rewardTokens[stakingNetworkId]}`}
            name='rewards'
            symbol={stakingNetworkId === 1 ? 'FUSE' : 'WFUSE'}
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
