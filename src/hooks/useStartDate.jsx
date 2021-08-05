import { useMemo } from 'react'
import moment from 'moment'

const useStartDate = (timeStr) => {
  return useMemo(() => {
    const time = Number(timeStr)
    return moment.unix(time)
  }, [timeStr])
}

export default useStartDate
