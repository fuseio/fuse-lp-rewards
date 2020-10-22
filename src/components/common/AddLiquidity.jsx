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
          <div className='grid-x align-middle align-justify'>
            <div className='content grid-x align-middle'>
              <img src={alertIcon} />
              <div className='text'>
                Please add liquidity on the DEX and deposit the TKN token received here to mine more $TKN.
                <br />
                Please refer to the guide for more details.
              </div>
            </div>
            <a
              rel='noreferrer noopener'
              target='_blank'
              href='https://info.uniswap.org/pair/0x4ce3687fed17e19324f23e305593ab13bbd55c4d'>
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
