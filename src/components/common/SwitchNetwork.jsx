import React, { useEffect, useState } from 'react'
import ReactModal from 'react-modal'
import { useSelector } from 'react-redux'
import { getNetworkName, networkIds } from '@/utils/network'
import SwitchToMainnet from '@/assets/images/Switch_To_Main.png'
import SwitchToFuse from '@/assets/images/step_1.png'

const SwitchNetwork = ({ networkId }) => {
  const { networkId: activeNetworkId } = useSelector((state) => state.network)
  const [modalStatus, setModalStatus] = useState(false)

  useEffect(() => {
    if (activeNetworkId) {
      if (activeNetworkId !== networkId) {
        setModalStatus(true)
      }

      if (activeNetworkId === networkId) {
        setModalStatus(false)
      }
    }
  }, [activeNetworkId])

  return (
    <ReactModal
      isOpen={modalStatus}
      overlayClassName='modal__overlay'
      className='modal__content'
    >
      <div className='info-modal'>
        <div className='title center'>
          Switch to {getNetworkName(networkId)} network
        </div>
        <div>
          {
            networkId === networkIds.FUSE
              ? <img src={SwitchToFuse} />
              : <img src={SwitchToMainnet} />
          }
        </div>
      </div>
    </ReactModal>
  )
}

export default SwitchNetwork
