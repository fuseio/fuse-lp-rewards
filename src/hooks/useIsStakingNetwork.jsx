import { useMemo } from 'react'
import { useSelector } from 'react-redux'

const useIsStakingNetwork = () => {
  const { networkId } = useSelector((state) => state.network)
  const { networkId: stakingNetworkId } = useSelector((state) => state.staking)
  return useMemo(() => networkId === stakingNetworkId, [
    networkId,
    stakingNetworkId
  ])
}

export default useIsStakingNetwork
