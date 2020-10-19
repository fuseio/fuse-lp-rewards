import React from 'react'
import InfoBox from '@/components/home/InfoBox'
import Tabs from '@/components/home/Tabs'

export default () => {
  return (
    <div className='main__wrapper'>
      <div className='main'>
        <h1 className='title'>Add liquidity</h1>
        <div className='boxs'>
          <InfoBox name='apy' />
          <InfoBox name='deposits' />
          <InfoBox name='rewards' />
        </div>
        <Tabs />
      </div>
    </div>
  )
}