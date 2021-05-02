import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { switchNetwork } from "@/actions/network";


const useSwitchNetwork = () => {
  const disptach = useDispatch()
  return useCallback(
    (networkId) => disptach(switchNetwork(networkId)),
    [disptach]
  )
}

export default useSwitchNetwork
