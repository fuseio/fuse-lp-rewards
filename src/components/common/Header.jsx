import React, { useState, useRef } from 'react'
import classNames from 'classnames'
import { withRouter } from 'react-router'
import { useSelector } from 'react-redux'
import AddLiquidity from '@/components/common/AddLiquidity'
import useOutsideClick from '@/hooks/useOutsideClick.jsx'
import { addressShortener } from '@/utils/format'
import walletIcon from '@/assets/images/wallet.svg'
import fuseLogoWhite from '@/assets/images/FuseLogo.png'
import explorerIcon from '@/assets/images/explorer.svg'
import get from 'lodash/get'

const NavBar = ({ history, handleConnect }) => {
  const [isOpen, setMenuOpen] = useState(false)
  const hamburgerRef = useRef(null)

  useOutsideClick(hamburgerRef, () => {
    if (isOpen) {
      setMenuOpen(false)
    }
  })

  const homePage = () => history.push('/')
  const { accountAddress } = useSelector(state => state.network)
  const { totalStaked = 0 } = useSelector(state => state.staking)
  const accounts = useSelector(state => state.accounts)
  const balance = get(accounts, [accountAddress, 'balances', CONFIG.stakeToken], 0)

  return (
    <div style={{ position: 'relative' }}>
      <header className='header__wrapper'>
        <div className='header'>
          <div onClick={homePage} className='header__logo'>
            <img alt='logo' src={fuseLogoWhite} />
          </div>
          <button ref={hamburgerRef} className='hamburger-button__container' onClick={() => setMenuOpen(!isOpen)}>
            <span className='hamburger-button__top' />
            <span className='hamburger-button__middle' />
            <span className='hamburger-button__bottom' />
          </button>
          <div className={classNames('header__nav', { header__nav__open: isOpen })}>
            <div className='header__link__wrapper'>
              <a
                rel='noreferrer noopener'
                className={classNames('header__link', { 'header__link--dark': isOpen })}
                target='_blank'
                href='https://explorer.fuse.io/'
              >
                <img src={explorerIcon} />Explorer
              </a>
              <a
                rel='noreferrer noopener'
                className={classNames('header__link', { 'header__link--dark': isOpen })}
                target='_blank' href='https://medium.com/fusenet/how-to-stake-eth-fuse-lp-tokens-for-fuse-rewards-fd9abe08f84c'
              >
                Guide
              </a>
            </div>
            {
              accountAddress ? (
                <div className='header__wallet header__wallet--logged-in'>
                  <span className='dot' />
                  <span className='text'>{addressShortener(accountAddress)}</span>
                </div>
              ) : (
                <div className='header__wallet header__wallet--logged-out' onClick={handleConnect}>
                  <img className='icon' src={walletIcon} />
                  <span className='text'>Connect wallet</span>
                </div>
              )
            }
          </div>
        </div>
      </header>
      {(!balance || balance === '0') && (!totalStaked || totalStaked === '0') && <AddLiquidity />}
    </div>
  )
}

export default withRouter(NavBar)
