import React, { useState, useRef } from 'react'
import classNames from 'classnames'
import get from 'lodash/get'
import { useRouteMatch, withRouter } from 'react-router'
import { useSelector } from 'react-redux'
import AddLiquidity from '@/components/common/AddLiquidity'
import useOutsideClick from '@/hooks/useOutsideClick.jsx'
import { addressShortener } from '@/utils/format'
import walletIcon from '@/assets/images/wallet.svg'
import fuseLogo from '@/assets/images/fuse_rewards.svg'
import explorerIcon from '@/assets/images/explorer.svg'
import stakingIcon from '@/assets/images/staking-icon.svg'

const NavBar = ({ history, handleConnect, handleLogout }) => {
  // TODO: Find a better way of handling this
  const stakingPageMatch = useRouteMatch('/staking-contract')
  const { stakingContract, lpToken } = useSelector(state => state.staking)
  const stakingContracts = useSelector(state => state.entities.stakingContracts)
  const { accountAddress, providerInfo } = useSelector(state => state.network)
  
  const [isOpen, setMenuOpen] = useState(false)
  const hamburgerRef = useRef(null)

  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useOutsideClick(hamburgerRef, () => {
    if (isOpen) {
      setMenuOpen(false)
    }
  })

  useOutsideClick(dropdownRef, () => {
    if (isDropdownOpen) {
      setDropdownOpen(false)
    }
  })

  const homePage = () => history.push('/')

  const accounts = useSelector(state => state.accounts)
  const balance = get(accounts, [accountAddress, 'balances', lpToken], 0)
  const totalStaked = get(stakingContracts, [stakingContract, 'totalStaked'], 0)

  return (
    <div style={{ position: 'relative' }}>
      <header className='header__wrapper'>
        <div className='header'>
          <div onClick={homePage} className='header__logo'>
            <img alt='logo' src={fuseLogo} />
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
                href='https://staking.fuse.io/'
              >
                <img src={stakingIcon} /> Staking
              </a>
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
              accountAddress
                ? (
                  <div 
                    className="header__wallet__wrapper" 
                    ref={dropdownRef} 
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                  >
                    <div className='header__wallet header__wallet--logged-in'>
                      <span className='dot' />
                      <span className='text'>{addressShortener(accountAddress)}</span>
                    </div>
                    <div 
                      className={classNames("header__wallet__dropdown", {
                        'header__wallet__dropdown--open': isDropdownOpen
                      })}
                    >
                      <div className="header__wallet__disconnect">
                        Connected to {get(providerInfo, 'name')}{' '} 
                        <a href="#" className="header__wallet__disconnect__link" onClick={(e) => {
                          e.preventDefault()
                          handleLogout()
                        }}>(disconnect)</a>
                      </div>
                    </div>
                  </div>
                  )
                : (
                  <div className='header__wallet header__wallet--logged-out' onClick={handleConnect}>
                    <img className='icon' src={walletIcon} />
                    <span className='text'>Connect wallet</span>
                  </div>
                  )
            }
          </div>
        </div>
      </header>
      {stakingPageMatch && stakingContract && (!Number(balance)) && (!Number(totalStaked)) ? <AddLiquidity /> : null}
    </div>
  )
}

export default withRouter(NavBar)
