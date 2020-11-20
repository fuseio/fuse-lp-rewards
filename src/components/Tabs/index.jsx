import React from 'react'
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs'
import { useSelector } from 'react-redux'
import DepositForm from './Deposit'
import WithdrawForm from './Withdraw'
import Stats from './Stats'

const CustomTab = ({ children, ...otherProps }) => (
  <Tab {...otherProps}>
    <h1>{children}</h1>
  </Tab>
)

CustomTab.tabsRole = 'Tab'

const CustomTabPanel = ({ children, className, ...otherProps }) => (
  <TabPanel {...otherProps}>
    <div className={className}>{children}</div>
  </TabPanel>
)

CustomTabPanel.tabsRole = 'TabPanel'

export default ({ handleConnect }) => {
  const { accountAddress } = useSelector(state => state.network)
  return (
    <Tabs className='tabs' selectedTabClassName={accountAddress ? 'tabs__tab--selected' : 'tabs__tab--disabled'}>
      <TabList className='tabs__list'>
        <CustomTab className='tabs__tab'>Deposit</CustomTab>
        <CustomTab className='tabs__tab'>Withdraw</CustomTab>
        <CustomTab className='tabs__tab'>Stats</CustomTab>
      </TabList>
      <CustomTabPanel className='tabs__panel'>
        <DepositForm handleConnect={handleConnect} />
      </CustomTabPanel>
      <CustomTabPanel className='tabs__panel'>
        <WithdrawForm handleConnect={handleConnect} />
      </CustomTabPanel>
      <CustomTabPanel className='tabs__panel'>
        <Stats />
      </CustomTabPanel>
    </Tabs>
  )
}
