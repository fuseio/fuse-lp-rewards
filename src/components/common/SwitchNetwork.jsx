import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { useSelector } from "react-redux";
import { getNetworkName } from "@/utils/network";
import SwitchToMainnet from "@/assets/images/Switch_To_Main.png";

const SwitchNetwork = ({ networkId }) => {
  const { networkId: activeNetworkId } = useSelector((state) => state.network);
  const [modalStatus, setModalStatus] = useState(false);

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
        <div>
          <img src={SwitchToMainnet} />
        </div>
      </div>
    </ReactModal>
  );
};

export default SwitchNetwork;
