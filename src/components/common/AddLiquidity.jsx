import React from 'react'
import { useSelector } from 'react-redux'
import { useSpring, animated } from 'react-spring'
import alertIcon from '@/assets/images/alert.svg'
import { symbolFromPair } from '@/utils/format'
import { getAddLiquidityLink, getPlatformName } from '@/utils'

const AddLiquidity = () => {
  const props = useSpring({
    opacity: 1,
    transform: 'translateY(0px)',
    from: { opacity: 0, transform: 'translateY(-20px)' }
  })
  const { pairs, pairName, networkId } = useSelector(state => state.staking)
  const symbol = symbolFromPair(pairName)
  const swapName = getPlatformName(networkId)

  return (
    <animated.div style={props}>
      <div className='add_liquidity'>
        <div className='add_liquidity__container'>
          <div className='grid-x align-middle align-justify grid-margin-x'>
            <div className='content cell large-auto'>
              <img src={alertIcon} />
              <div className='text'>
                <div className='beta'>Beta - use at your own risk.</div>
                Please add liquidity to the {swapName} {symbol} pool and deposit the LP token received here to mine more FUSE.
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
            <a
              rel='noreferrer noopener'
              target='_blank'
              className='cell medium-6 small-24'
              href={(getAddLiquidityLink(pairs, networkId))}
            >
              <button className='button'>
                Add liquidity on {swapName}
              </button>
            </a>
          </div>
        </div>
      </div>
    </animated.div>
  )
}

export default AddLiquidity
