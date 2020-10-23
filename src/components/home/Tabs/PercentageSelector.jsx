import React from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import { formatWeiToNumber } from '@/utils/format'
import { Field } from 'formik'
const percentValues = [25, 50, 75, 100]

const calculate = (value, total) => (value / 100) * total

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
                setFieldValue('amount', calculate(value, formatWeiToNumber(balance)))
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
      {
        percentValues.map((value) => {
          return (
            <PercentOption key={value} value={value} balance={balance} />
          )
        })
      }
    </div>
  )
}

export default PercentageSelector
