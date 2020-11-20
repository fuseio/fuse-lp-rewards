import { put, takeEvery, delay } from 'redux-saga/effects'

export const createEntityPut = (entity) => (action) => put({ ...action, entity })

export const entityKeys = {
  stakingContracts: 'address'
}

function * tryClause (args, error, action, numberOfTries = 1) {
  yield put({
    ...args,
    error,
    type: action.FAILURE
  })
  args = { ...args, numberOfTries: args.numberOfTries ? args.numberOfTries + 1 : 1 }
  if (args.numberOfTries < numberOfTries) {
    yield delay(500)
    yield put(args)
  }
}

export function tryCatch (action, saga, numberOfTries) {
  return function * wrappedTryCatch (args) {
    try {
      yield saga(args)
    } catch (error) {
      yield tryClause(args, error, action, numberOfTries)
    }
  }
}

export const tryTakeEvery = (action, saga, numberOfTries) => takeEvery(action.REQUEST, tryCatch(action, saga, numberOfTries))
