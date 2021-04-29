import moment from 'moment'
import { useMemo } from 'react'

const useFormattedTimestamp = (timestamp, format = 'D.M.YYYY') => {
  return useMemo(() => moment(timestamp).format(format))
}

export default useFormattedTimestamp
