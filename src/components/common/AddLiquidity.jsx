import React from 'react'
import { useSpring, animated } from 'react-spring'
import alertIcon from '@/assets/images/alert.svg'

const AddLiquidity = () => {
  const props = useSpring({
    opacity: 1,
    transform: 'translate(0px, 0px)',
    from: { opacity: 0, transform: 'translate(-20px, -20px)' }
  })

  return (
    <animated.div style={props}>
      <div className='add_liquidity'>
        <div className='add_liquidity__container'>
          <div className='grid-x align-middle align-justify grid-margin-x'>
            <div className='content cell large-auto'>
              <img src={alertIcon} />
              <div className='text'>
                Please add liquidity to the Uniswap FUSE-ETH pool and deposit the LP token received here to mine more FUSE.
                <br />
                Please refer to the guide for more details.
              </div>
            </div>
            <a
              rel='noreferrer noopener'
              target='_blank'
              className='cell medium-6 small-24'
              href='https://app.uniswap.org/#/add/0x970B9bB2C0444F5E81e9d0eFb84C8ccdcdcAf84d/ETH'>
              <button className='button'>
                Add liquidity on Uniswap
              </button>
            </a>
          </div>
        </div>
      </div>
    </animated.div >
  )
}

export default AddLiquidity
