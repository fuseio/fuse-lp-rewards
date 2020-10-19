import React, { useState, useRef } from 'react'
import { withRouter } from 'react-router'
import { useSelector } from 'react-redux'
import { addressShortener } from '@/utils/format'
import walletIcon from '@/assets/images/wallet.svg'
import fuseLogoWhite from '@/assets/images/fuse-logo-white.svg'

const NavBar = ({ history, web3connect }) => {
  const homePage = () => history.push('/')
  const { accountAddress } = useSelector(state => state.network)

  return (
    <header className='header__wrapper'>
      <div className='header'>
        <div onClick={homePage} className='header__logo'>
          <img alt="logo" src={fuseLogoWhite} />
        </div>
        {
          accountAddress ? (
            <div className='header__wallet header__wallet--logged-in' onClick={web3connect.toggleModal}>
              <span className='dot'></span>
              <span className='text'>{addressShortener(accountAddress)}</span>
            </div>
          ) : (
              <div className='header__wallet header__wallet--logged-out' onClick={web3connect.toggleModal}>
                <img className='icon' src={walletIcon} />
                <span className='text'>Connect wallet</span>
              </div>
            )
        }
      </div>
    </header>
  );
}

export default withRouter(NavBar)