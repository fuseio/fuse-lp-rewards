import { useMemo } from 'react'
import moment from 'moment'

const useEndDate = (startTimeStr, periodTimeStr) => {
  return useMemo(() => {
    const startTime = Number(startTimeStr)
    const periodTime = Number(periodTimeStr)

    const end = moment.unix(startTime + periodTime).diff(moment())
    return Date.now() + end
  }, [startTimeStr, periodTimeStr])
}

export default useEndDate
