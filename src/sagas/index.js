import { all, fork } from 'redux-saga/effects'

import networkSaga from './network'
import accountsSaga from './accounts'
import stakingSaga from './staking'

export default function * rootSaga () {
  yield all([
    fork(networkSaga),
    fork(accountsSaga),
    fork(stakingSaga)
  ])
}
