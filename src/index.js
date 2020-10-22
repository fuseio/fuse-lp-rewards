import React from 'react'
import { render } from 'react-dom'
import { ModalProvider } from 'react-modal-hook'
import Modal from 'react-modal'
import { TransitionGroup } from 'react-transition-group'
import App from './App'
import './styles/styles.scss'

// imports all images so webpack can compile them
((ctx) => {
  const keys = ctx.keys()
  const values = keys.map(ctx)
  return keys.reduce((o, k, i) => {
    const a = { ...o }
    a[k] = values[i]
    return { ...a }
  }, {})
})(require.context('./assets', true, /.*/))

Modal.setAppElement('#root')

render(
  <ModalProvider rootComponent={TransitionGroup}>
    <App />
  </ModalProvider>,
  document.getElementById('root'))
