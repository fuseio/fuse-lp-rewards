import { all, fork } from 'redux-saga/effects'

import networkSaga from './network'
import accountsSaga from './accounts'
import miningSaga from './mining'

export default function* rootSaga() {
  yield all([
    fork(networkSaga),
    fork(accountsSaga),
    fork(miningSaga),
  ])
}
