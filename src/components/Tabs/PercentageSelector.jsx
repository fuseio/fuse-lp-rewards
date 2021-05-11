import React from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import { BigNumber } from 'bignumber.js'
import { Field } from 'formik'
import web3 from 'web3'
const percentValues = [25, 50, 75, 100]

const calculate = (value, total) => web3.utils.fromWei(value.div(100).times(total).toString())

const PercentOption = ({ value, balance }) => {
  const { accountAddress } = useSelector(state => state.network)
  return (
    <label className='percent_option'>
      <Field>
        {({ field, form: { setFieldValue } }) => (
          <>
            <input
              {...field}
              type='radio'
              onChange={(e) => {
                field.onChange(e)
                setFieldValue('amount', calculate(new BigNumber(value), new BigNumber(balance)))
              }}
              name='percent'
              value={value}
            />
            <span className={classNames('text', { 'text--disabled': !accountAddress })}>{value} %</span>
          </>
        )}
      </Field>
    </label>
  )
}
const PercentageSelector = ({ balance }) => {
  return (
    <div className='percent_wrapper grid-x align-middle align-justify'>
      {percentValues.map((value) => <PercentOption key={value} value={value} balance={balance} />)}
    </div>
  )
}
export default PercentageSelector
