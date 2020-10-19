import React from 'react'
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs'
// import { useDispatch, useSelector } from 'react-redux'
import DepositForm from './Deposit'
import WithdrawForm from './Withdraw'

const CustomTab = ({ children, ...otherProps }) => (
  <Tab className='tabs__tab' {...otherProps}>
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

const TabsWrapper = () => {
  return (
    <Tabs className='tabs' selectedTabClassName='tabs__tab--selected'>
      <TabList className='tabs__list'>
        <CustomTab>Deposit</CustomTab>
        <CustomTab>Withdraw</CustomTab>
        <CustomTab>Stats</CustomTab>
      </TabList>
      <CustomTabPanel className='tabs__panel'><DepositForm /></CustomTabPanel>
      <CustomTabPanel className='tabs__panel'><WithdrawForm /></CustomTabPanel>
      <CustomTabPanel className='tabs__panel'>Panel 3</CustomTabPanel>
    </Tabs>
  )
}

export default TabsWrapper
