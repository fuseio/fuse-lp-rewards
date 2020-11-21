import React from 'react'
import { useSelector } from 'react-redux'
import replace from 'lodash/replace'
import { useSpring, animated } from 'react-spring'
import alertIcon from '@/assets/images/alert.svg'

const AddLiquidity = () => {
  const props = useSpring({
    opacity: 1,
    transform: 'translate(0px, 0px)',
    from: { opacity: 0, transform: 'translate(-20px, -20px)' }
  })
  const { lpToken, pairName, networkId } = useSelector(state => state.staking)
  const symbol = replace(pairName, '/', '-')

  return (
    <animated.div style={props}>
      <div className='add_liquidity'>
        <div className='add_liquidity__container'>
          <div className='grid-x align-middle align-justify grid-margin-x'>
            <div className='content cell large-auto'>
              <img src={alertIcon} />
              <div className='text'>
                <div className='beta'>Beta - use at your own risk.</div>
                Please add liquidity to the {networkId === 1 ? 'Uniswap' : 'FuseSwap'} {symbol} pool and deposit the LP token received here to mine more FUSE.
                <br />
                <a
                  rel='noreferrer noopener'
                  target='_blank'
                  href='https://medium.com/fusenet/how-to-stake-eth-fuse-lp-tokens-for-fuse-rewards-fd9abe08f84c'
                >
                  Please refer to the guide for more details.
                </a>
              </div>
            </div>
            {/* TODO - add FuseSwap pair link after release */}
            <a
              rel='noreferrer noopener'
              target='_blank'
              className='cell medium-6 small-24'
              href={`https://app.uniswap.org/#/add/${lpToken}/ETH`}
            >
              <button className='button'>
                Add liquidity on Uniswap
              </button>
            </a>
          </div>
        </div>
      </div>
    </animated.div>
  )
}

export default AddLiquidity
