import React from 'react'
import { withRouter } from 'react-router'
import { useSelector } from 'react-redux'
import AddLiquidity from '@/components/common/AddLiquidity'
import { addressShortener } from '@/utils/format'
import walletIcon from '@/assets/images/wallet.svg'
import fuseLogoWhite from '@/assets/images/fuse-logo-white.svg'
import explorerIcon from '@/assets/images/explorer.svg'
import get from 'lodash/get'

const NavBar = ({ history, handleConnect }) => {
  const homePage = () => history.push('/')
  const { accountAddress } = useSelector(state => state.network)
  const { totalStaked = 0 } = useSelector(state => state.staking)
  const accounts = useSelector(state => state.accounts)
  const balance = get(accounts, [accountAddress, 'balances', CONFIG.stakeToken], 0)

  return (
    <div style={{ position: 'relative' }}>
      <header className='header__wrapper'>
        <div className='header grid-x align-justify align-middle'>
          <div className='grid-x align-middle'>
            <div onClick={homePage} className='header__logo'>
              <img alt='logo' src={fuseLogoWhite} />
            </div>
            <div className='link grid-x align-middle align-center'>
              <img src={explorerIcon} />
              <a
                rel='noreferrer noopener'
                target='_blank'
                href='http://explorer.fuse.io/'
              >
                Explorer
              </a>
            </div>
            <div className='link grid-x align-middle align-center'>
              <a
                rel='noreferrer noopener'
                target='_blank'
                href='https://medium.com/@robert_31058/6cff4f9227c'
              >
                Guide
              </a>
            </div>
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
      </header>
      {(!balance || balance === '0') && (!totalStaked || totalStaked === '0') && <AddLiquidity />}
    </div>
  )
}

export default withRouter(NavBar)
