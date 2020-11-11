import React from 'react'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { push } from 'connected-react-router'
import { selectContractVersion } from '@/actions/staking'

const options = [
  // {
  //   value: 'v1',
  //   title: 'Round 1',
  //   Text: () => (
  //     <div className='option__text cell shrink'>This round of rewards <strong>has ended on Saturday, November 7th at 4pm GMT</strong>. If you participated in this round of rewards please withdraw your funds.</div>
  //   ),
  //   btnText: 'Withdraw'
  // },
  {
    value: 'v2',
    title: 'Round 2',
    Text: () => (
      <div className='option__text cell shrink'>This round of rewards <strong>has begun on Saturday, November 7th at 3pm GMT</strong>. If you'd like to participate is this round of rewards please deposit funds.</div>
    ),
    btnText: 'Deposit'
  }
]

const Option = ({ value, title, Text, btnText }) => {
  const dispatch = useDispatch()
  const { stakingContract } = useSelector(state => state.staking)

  const handleClick = () => {
    dispatch(selectContractVersion(CONFIG.stakingContracts[value]))
    dispatch(push('/home'))
  }

  return (
    <div
      className={classNames('option grid-x align-middle align-center cell', { 'option--selected': value === stakingContract })}
    >
      <div className='option__title cell shrink'>{title}</div>
      <Text />
      <div className='cell grid-x align-right'>
        <button className='button' onClick={handleClick}>{btnText}</button>
      </div>
    </div>
  )
}

export default () => {
  return (
    <div className='choose_staking grid-x align-middle align-justify'>
      {
        options.map((option, index) => {
          return <Option {...option} key={index} />
        })
      }
    </div>
  )
}
