import React, { useCallback, useEffect, useState } from "react";
import ReactModal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { getNetworkName } from "@/utils/network";
import SwitchToMainnet from "@/assets/images/Switch_To_Main.png";
import { switchNetwork as switchNetworkAction } from "@/actions/network";

const SwitchNetwork = ({ networkId }) => {
  const dispatch = useDispatch();
  const { networkId: activeNetworkId } = useSelector((state) => state.network);
  const [modalStatus, setModalStatus] = useState(false);

  const switchNetwork = useCallback(
    () => dispatch(switchNetworkAction(networkId)),
    [networkId]
  );

  useEffect(() => {
    if (activeNetworkId) {
      if (activeNetworkId !== networkId) {
        setModalStatus(true);
      }

      if (activeNetworkId === networkId) {
        setModalStatus(false);
      }
    }
  }, [activeNetworkId]);

  return (
    <ReactModal
      isOpen={modalStatus}
      overlayClassName="modal__overlay"
      className="modal__content"
    >
      <div className="info-modal">
        <div className="title center">
          Switch to {getNetworkName(networkId)} network
        </div>
        {networkId === 1 ? (
          <div>
            <img src={SwitchToMainnet} />
          </div>
        ) : (
          <div>
            <button onClick={switchNetwork}>
              Click to switch
            </button>
          </div>
        )}
      </div>
    </ReactModal>
  );
};

export default SwitchNetwork;
